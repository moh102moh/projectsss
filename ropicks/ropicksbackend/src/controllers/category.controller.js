import {Category , Product} from '../models/index.js';

 export const createCategory = async (req,res)=>{
    try{
        const {name } = req.body;
        const c = await Category.create({name });
        return res.status(201).json(c);
    }catch(err){
        return res.status(400).json({message : err.massage});
    }
};
export const listCategories = async(req ,res)=>{
    const cats = await Category.findAll({include : [{model : Product , as : 'products'}]});
    return res.status(201).json(cats);

};
export const updateCategory = async (req,res) =>{
    const cat = await Category.findByPk(req.params.id);
    if(!cat)
        return res.status(404).json({message : 'Category not found'});
    await cat.update(req.body);
    return res.status(201).json(cat);
};
export const deleteCategoery = async (req,res) =>{
    const cat = await Category.findByPk(req.params.id);
    if(!cat)
        return res.status(404).json({message : 'Category not found'});
    await cat.destroy();
    return res.status(201).json({message : 'Category deleted successfully'});

};