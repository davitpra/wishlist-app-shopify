import { json } from "@remix-run/node";
import db from "../db.server";
import { cors } from 'remix-utils/cors';

// get request: accept request with request: customerId, shop, productId.
// read database and return wishlist items for that customer.
export async function loader({ request }) {

    // Get wishlist items for a specific customer
    const url = new URL(request.url);
    const custumerId = url.searchParams.get("custumerId");
    const shop = url.searchParams.get("shop");
    const productId = url.searchParams.get("productId");
  
    // If customerId, shop, productId is not provided, return an error message.
    if(!custumerId || !shop || !productId) {
        return json({
          message: "Missing data. Required data: customerId, productId, shop",
          method: "GET"
        });
      }
    
    // If customerId, shop, productId is provided, return wishlist items for that customer.
    const wishlist = await db.wishlist.findMany({
        where: {
        custumerId: custumerId,
        shop: shop,
        productId: productId,
        },
    });

    // Return wishlist items
    const response = json({
        ok: true,
        message: "Success",
        data: wishlist,
    });
    
    // Return response
    return cors(request, response);
}

// Expexted data comes from post request. If
// customerID, productID, shop
export async function action({ request }) {

    // Get data from request body and convert it to an object
    let data = await request.formData();
    data = Object.fromEntries(data);

    const custumerId = data.custumerId;
    const productId = data.productId;
    const shop = data.shop;
    // here comes the action method (CREATE,DELETE)
    const _action = data._action;

    if (!custumerId || !productId || !shop) {
        return json({ 
            message: "Missing required fields. Required fields are customerId, productId, and shop.",
            method: _action
        });
    }

    let response;

    if (_action === "CREATE") {
      // Handle POST request logic here
      // For example, adding a new item to the wishlist
        const wishlist = await db.wishlist.create({
            data: {
                custumerId,
                productId,
                shop,
            },
        });

        response = json({
            message: "Product added to wishlist",
            method: _action,
            wishlisted: true
        });
        return cors(request, response)
    }

     //TODO: UPDATE THE WISHLIST PRODUCT
    if (_action === "PATCH") {
        let message = 'Product updated in wishlist';
   
        return json({
            message,
             method: "PATCH"
        });
    }

    if (_action === "DELETE") {
        // Handle DELETE request logic here (Not tested)
        // For example, removing an item from the wishlist
        await db.wishlist.deleteMany({
            where: {
            custumerId: custumerId,
            shop: shop,
            productId: productId,
            },
        });
        response = json({ 
            message: "Product removed from your wishlist", 
            method: _action, 
            wishlisted: false 
        });
        return cors(request, response)
    }

    return json({ message: "Method not allowed" });
}