import { json } from "@remix-run/node";

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

    if (method === "POST") {
        let message = 'Product added to wishlist';

        return json({
            message,
             method: "POST"
        });
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