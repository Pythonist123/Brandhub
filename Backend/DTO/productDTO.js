class ProductDTO{
    constructor(_id,name,description,price,categoryID,availableSizes,color,image,inStock){
        this._id = _id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.categoryID = categoryID;
        this.availableSizes = availableSizes;
        this.color = color;
        this.image = image;
        this.inStock = inStock;
    }

     getProps(){
        return {
            id:this._id 
            ,name:this.name 
            ,description: this.description
            ,price:this.price 
            ,categoryID:this.categoryID 
            ,sizes:this.availableSizes 
            ,color:this.color 
            ,image:this.image 
            ,stock:this.inStock
        }
    }
}

export default ProductDTO;