import { redirect } from "@remix-run/node";
import { authenticate, MONTHLY_PLAN } from "../shopify.server";


export const loader = async ({ request }) => {
    // Authentication
  const { billing ,session} = await authenticate.admin(request);
  let {shop} = session;
  // Billing check
  let myshop = shop.replace('.myshopify.com', '');

  await billing.require({
    plans: [MONTHLY_PLAN],
    isTest: true,
    // if the check fails, redirect to the pricing page
    onFailure: async () => billing.request({
        plan: MONTHLY_PLAN,
        test: true,
        returnUrl: `https://admin.shopify.com/store/${myshop}/apps/${process.env.APP_NAME}/app/pricing`,
        }),
  });
  
  // App logic

return null;
};