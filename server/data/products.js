const mongoCollections = require("../config/mongoCollection");
const products = mongoCollections.products;
let { ObjectId } = require("mongodb");

function checkInputs(
  productName,
  description,
  websiteUrl,
  logo,
  tags,
  developer
) {
  //If arguments are not provided
  if (
    !productName ||
    !description ||
    !websiteUrl ||
    !tags ||
    !developer ||
    !logo
  )
    throw "Error: All arguments have not been provided";
  // check if type is alright
  if (typeof productName !== "string" || productName.trim().length < 1) {
    throw "Error: product_name, description and website_Url are not strings";
  }
  if (typeof description !== "string" || description.trim().length < 1)
    throw "Error Descritpion is not a string";
  if (typeof websiteUrl !== "string" || websiteUrl.trim().length < 1)
    throw "Error: website_Url is not a string";

  if (websiteUrl.startsWith("http://www.") && websiteUrl.endsWith(".com")) {
    throw "Error: Website URL is invalid";
  }
  let midString = websiteUrl.substring(
    websiteUrl.indexOf(".") + 1,
    websiteUrl.lastIndexOf(".")
  );
  if (midString.length < 5) {
    throw "Error: Website name is less than 5 characters";
  }
}
//
// Just a helper function to check db id's
//
function checkID(id) {
  if (!id) throw "Error: Please provide argument id";
  //if (typeof id !== "string") throw "Error:ID is not of string type.";
  if (typeof id === "string" && id.trim().length < 1) {
    //console.log(typeof id);
    throw "Error: ID is a blank string has been passed as argument";
  }
  //console.log(ObjectId.isValid(id));
  if (!ObjectId.isValid(id))
    throw "Error: Provided ID is not valid argument (data)";
}
let exportedMethods = {
  async getAllProducts() {
    const productCollection = await products();
    const prodList = await productCollection.find({}).limit(10).toArray();
    const sorted = prodList.sort(prodList.likes);
    if (prodList.length === 0) throw "Error:No products in the database";
    console.log("get all test");
    return sorted;
  },

  async getProductById(product_Id) {
    checkID(product_Id);
    objId_product = ObjectId(product_Id);
    const prod_List = await products();
    const prodId = await prod_List.findOne({ _id: objId_product });
    if (prodId === null) throw "No product found";
    return prodId;
  },
  //addProduct method
  // Need to still check how images will be added to this
  async addProduct(
    productName,
    description,
    websiteUrl,
    logo,
    tags,
    developer
  ) {
    productName = productName.trim();
    websiteUrl = websiteUrl.trim();
    checkInputs(productName, description, websiteUrl, logo, tags, developer);
    const productList = await products();
    let newProduct = {
      productName: productName,
      description: description,
      websiteUrl: websiteUrl,
      logo: logo,
      tags: tags,
      developer: developer,
      rating: 0.0,
      likes: 0,
    };
    const insertProd = await productList.insertOne(newProduct);
    if (insertProd.insertedCount === 0)
      throw "We are sorry. An error occured while adding the product. Please try again.";
    const dbId = await insertProd.insertedId;
    //console.log(typeof dbId);
    const addProduct = await this.getProductById(dbId.toString());
    //console.log(typeof addRest);
    return addProduct;
  },

  //
  // This a helper function is used to increment the like counter by 1
  //
  async updateCount(product_Id, action) {
    objId = ObjectId(product_Id);
    const productCollection = await products();
    const prod_Id = await productCollection.findOne({ _id: objId });
    let updated_Like;
    if (restaurantID === null) throw "No restaurant with this ID";
    if (action === true) {
      updated_Like = parseInt(product_Id.likes) + 1;
    } else {
      updated_Like = parseInt(product_Id.likes) - 1;
    }
    const updated_detials = { likes: updated_Like };
    const updated = await productCollection.updateOne({
      _id: objId,
      $set: updated_detials,
    });
    if (updated.modifiedCount === 0) {
      throw "Could not update the product because it was not found in the database";
    }
    return await this.get(objId);
  },

  //
  // This function will get a product by name search
  // using something called text search from Mongo db-  don't need this
  //returns array of objects containing matches

  //https://www.guru99.com/regular-expressions-mongodb.html - this talks about using regex to search

  async getProductByProductName(textToSearch) {
    if (typeof textToSearch !== "string")
      throw "Error: The input is not a string";
    textToSearch = textToSearch.toLowerCase();
    const query = new RegExp(textToSearch, "i");
    const productCollection = await products();
    if (!productCollection) throw "Error: Empty DB";
    const productByName = await productCollection
      .find({
        product_Name: { $regex: query },
      })
      .toArray();
    if (!productByName) throw "Error: No Matches";
    const sortedNameBylikes = productByName.sort(productByName.likes);
    return sortedNameBylikes;
  },

  //
  // This function will get a product by tag
  //
  async getProductbyTag(tagSearch) {
    if (typeof tagSearch !== "string") throw "Error: The input is not a string";
    tagSearch = tagSearch.toLowerCase();
    const query = new RegExp(textToSearch, "i");
    const productCollection = await products();
    const productByTag = await productCollection
      .find({
        tags: { $regex: query },
      })
      .toArray();
    if (!productByTag) throw "Error: No Matches";
    const soredTagByLikes = productByTag.sort(productByTag.likes);
    return soredTagByLikes;
  },

  //
  // This function will delete a product
  //
  async deleteProduct(user_Id, product_Id) {
    checkID(user_Id);
    checkID(product_Id);
    objId_user = ObjectId(user_Id);
    objId_product = ObjectId(product_Id);
    const prooductCollection = await products();
    const delProduct = await productCollection.findOne({
      _id: objId_product,
    });
    if (!delProduct) throw "Error:Product not found!";
    updateCount(objId_product, false);
    // we need to authenticate the user tryig to delete the product info

    if (removed.deletedCount == 0) {
      throw `Could not delete Restaurant ${delProduct.name}`;
    } else {
      return `${delProduct.name} has been successfully deleted!`;
    }
  },
};
module.exports = exportedMethods;
