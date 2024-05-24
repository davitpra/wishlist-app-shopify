import { json } from "@remix-run/node";
import db from "../db.server";
import { cors } from 'remix-utils/cors';

export async function loader() {
    // 
    const wishlist = [
        {
        id: 1,
        name: "Product 1",
        price: 100,
        },
        {
        id: 2,
        name: "Product 2",
        price: 200,
        },
    ];
    
    return json(wishlist);
}

export async function action({ request }) {

    const method = request.method;
    
    let data = await request.formData();
    data = Object.fromEntries(data);

    const custumerId = data.custumerId;
    const productId = data.productId;
    const shop = data.shop;

    if (!custumerId || !productId || !shop) {
        return json({ 
            message: "Missing required fields. Required fields are customerId, productId, and shop.",
            method: method
        });
    }

    if (method === "POST") {

        const wishlist = await db.wishlist.create({
            data: {
                custumerId,
                productId,
                shop,
            },
        });

        const response = json({
            message: "Product added to wishlist",
            method: "POST",
            wishlist
        });
        return cors(request, response)
    }

    if (method === "PATCH") {
        let message = 'Product updated in wishlist';

        return json({
            message,
             method: "PATCH"
        });
    }

    if (method === "DELETE") {
        let message = 'Product removed from wishlist';
        return json({
            message,
             method: "DELETE"
        });
    }

    return json({ message: "Method not allowed" });
}