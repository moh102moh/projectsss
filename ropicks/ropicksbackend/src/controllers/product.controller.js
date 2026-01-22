import fs from 'fs';
import path from 'path';
import { Op } from 'sequelize';
import {
  Product,
  Category,
  ProductImage,
  ProductColor,
  sequelize
} from '../models/index.js';

function tryParseJSON(value) {
  if (!value) return null;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

const buildUrl = (file) => `/uploads/${file.filename}`;

/* ================= CREATE ================= */
export const createProduct = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      name,
      description,
      price,
      discountedPrice,
      quantity,
      categoryId,
      sku,
      specs,
      warrantyMonths,
      warrantyLabel,
      colors
    } = req.body;

    if (!name || !price || !quantity || !categoryId || !sku) {
      await t.rollback();
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const product = await Product.create({
      name,
      description: description || null,
      price,
      discountedPrice: discountedPrice || null,
      quantity,
      categoryId,
      sku,
      specs: tryParseJSON(specs),
      warrantyMonths: warrantyMonths ? parseInt(warrantyMonths, 10) : null,
      warrantyLabel: warrantyLabel || null
    }, { transaction: t });

    const colorsArr = tryParseJSON(colors) || [];
    if (Array.isArray(colorsArr)) {
      await ProductColor.bulkCreate(
        colorsArr.map(c => ({
          productId: product.id,
          colorName: c.colorName || c.name || 'unknown',
          quantity: parseInt(c.quantity || 0, 10),
          colorHex: c.colorHex || null,
          sku: c.sku || null
        })),
        { transaction: t }
      );
    }

    if (req.files?.length) {
      await ProductImage.bulkCreate(
        req.files.map((f, i) => ({
          productId: product.id,
          url: buildUrl(f),
          position: i
        })),
        { transaction: t }
      );
    }
    

    await t.commit();

    const result = await Product.findByPk(product.id, {
      include: ['images', 'category', 'colors']
    });

    return res.status(201).json(result);
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

/* ================= LIST ================= */
export const listProducts = async (req, res) => {
  try {
    const where = {};
    if (req.query.categoryId) where.categoryId = req.query.categoryId;
    if (req.query.q) where.name = { [Op.like]: `%${req.query.q}%` };

    const products = await Product.findAll({
      where,
      include: ['images', 'category', 'colors'],
      order: [['createdAt', 'DESC']]
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ONE ================= */
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: ['images', 'category', 'colors']
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE ================= */
export const updateProduct = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      name,
      description,
      price,
      discountedPrice,
      quantity,
      categoryId,
      sku,
      specs,
      warrantyMonths,
      warrantyLabel,
      colors
    } = req.body;

    const product = await Product.findByPk(req.params.id, {
      include: ['images'],
      transaction: t
    });

    if (!product) {
      await t.rollback();
      return res.status(404).json({ message: 'Product not found' });
    }

   
    await product.update({
      name,
      description: description || null,
      price,
      discountedPrice: discountedPrice || null,
      quantity,
      categoryId,
      sku,
      specs: tryParseJSON(specs),
      warrantyMonths: warrantyMonths ? parseInt(warrantyMonths, 10) : null,
      warrantyLabel: warrantyLabel || null
    }, { transaction: t });


    if (colors !== undefined) {
      await ProductColor.destroy({
        where: { productId: product.id },
        transaction: t
      });

      const colorsArr = tryParseJSON(colors) || [];
      if (Array.isArray(colorsArr)) {
        await ProductColor.bulkCreate(
          colorsArr.map(c => ({
            productId: product.id,
            colorName: c.colorName || c.name || 'unknown',
            quantity: parseInt(c.quantity || 0, 10),
            colorHex: c.colorHex || null,
            sku: c.sku || null
          })),
          { transaction: t }
        );
      }
    }


    if (req.files && req.files.length > 0) {
   
      for (const img of product.images) {
        const filePath = path.join(process.cwd(), img.url.replace(/^\//, ''));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      await ProductImage.destroy({
        where: { productId: product.id },
        transaction: t
      });

     
      await ProductImage.bulkCreate(
        req.files.map((f, i) => ({
          productId: product.id,
          url: buildUrl(f),
          position: i
        })),
        { transaction: t }
      );
    }

    await t.commit();

    const updated = await Product.findByPk(product.id, {
      include: ['images', 'category', 'colors']
    });

    res.json(updated);
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE ================= */
export const deleteProduct = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const product = await Product.findByPk(req.params.id, {
      include: ['images'],
      transaction: t
    });

    if (!product) {
      await t.rollback();
      return res.status(404).json({ message: 'Product not found' });
    }

    for (const img of product.images) {
      const filePath = path.join(process.cwd(), img.url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await ProductImage.destroy({ where: { productId: product.id }, transaction: t });
    await ProductColor.destroy({ where: { productId: product.id }, transaction: t });
    await product.destroy({ transaction: t });

    await t.commit();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
