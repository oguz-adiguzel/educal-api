const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({message:"Kategori oluşturuldu"})
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.getCategory = async(req,res)=>{
  try{
    const category = await Category.find()
    res.status(200).json({message:'Kategoriler getirildi' ,categories: category})
  }catch(error){
    console.log('error', error);
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndRemove(req.params.id);
    res.status(200).json({message:'Kategori silindi'})
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};