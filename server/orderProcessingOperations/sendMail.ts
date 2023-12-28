import { categoryWithProductsInfo } from "./createOrder";
import { productInfoOfInsufficientQuantity } from "./orderPaid";
require('dotenv').config({ path: '../../.env' });

type ProcessType = "order" | "refund";

export const sendEmail = async (
    receiverMail: string,
    processType: ProcessType,
    processID: string,
    categoryWithProductsInfo?: categoryWithProductsInfo[],
    productInfoOfInsufficientQuantity?: productInfoOfInsufficientQuantity[]
) => {
    const url = process.env.VITE_EMAIL_SERVER_URL as string; // Replace this with your email API endpoint

    let invoiceTableHTML = '';
    let messageHeader = '';
    let amount = 0;

    if (processType === "order") {
        messageHeader = `Thank you for shopping with us. Your order has been successfully placed. Your order ID is ${processID}.`;
        if (categoryWithProductsInfo) {
            categoryWithProductsInfo.forEach((category) => {
                category.products.forEach((item, index) => {
                    amount += item.quantity * item.price;
                    invoiceTableHTML += `
            <tr>
              <td style="border: 1px solid black; text-align: left; padding: 8px;">${index}</td>
              <td style="border: 1px solid black; text-align: left; padding: 8px;">${item.name}</td>
              <td style="border: 1px solid black; text-align: left; padding: 8px;">${item.quantity}</td>
              <td style="border: 1px solid black; text-align: left; padding: 8px;">&#x20B9;${item.price}</td>
              <td style="border: 1px solid black; text-align: left; padding: 8px;">&#x20B9;${item.quantity * item.price}</td>
            </tr>
          `;
                });
            });
        }
    } else if (processType === "refund") {
        messageHeader = `Thank you for shopping with us. We are sorry to inform you that some products has went out of stock. Your refund has been successfully processed. Your refund ID is ${processID}.`;
        if (productInfoOfInsufficientQuantity) {
            productInfoOfInsufficientQuantity.forEach((product, index) => {
                amount += product.quantity * product.price;
                invoiceTableHTML += `
          <tr>
            <td style="border: 1px solid black; text-align: left; padding: 8px;">${index}</td>
            <td style="border: 1px solid black; text-align: left; padding: 8px;">${product.name}</td>
            <td style="border: 1px solid black; text-align: left; padding: 8px;">${product.quantity}</td>
            <td style="border: 1px solid black; text-align: left; padding: 8px;">&#x20B9;${product.price}</td>
            <td style="border: 1px solid black; text-align: left; padding: 8px;">&#x20B9;${product.quantity * product.price}</td>
          </tr>`;
            });
        }
    }

    const bodyHTML = `
    <p style="font-weight: bold;">${messageHeader}</p>
    <p></p>
    <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="border: 1px solid black;">
              <th style="border: 1px solid black; text-align: left; padding: 8px; font-weight: bold;">Sr. No.</th>
              <th style="border: 1px solid black; text-align: left; padding: 8px; font-weight: bold;">Product</th>
              <th style="border: 1px solid black; text-align: left; padding: 8px; font-weight: bold;">Quantity</th>
              <th style="border: 1px solid black; text-align: left; padding: 8px; font-weight: bold;">Price per Quantity</th>
              <th style="border: 1px solid black; text-align: left; padding: 8px; font-weight: bold;">Total Price</th>
          </tr>
        </thead>
        <tbody>
          ${invoiceTableHTML}
          <tr style="border: 1px solid black;">
              <td colspan="4" style="border: 1px solid black; text-align: left; padding: 8px; font-weight: bold;">Sub Total</td>
              <td style="border: 1px solid black; text-align: left; padding: 8px;">&#x20B9;${amount}</td>
          </tr>
        </tbody>
    </table>
    <br/>
    <br/>
    <br/>
    <br/>
    <p>Happy shopping!<br/>Team EarthlyEco</p>
  `;

    const data = {
        receiver: receiverMail,
        subject: `Your EarthlyEco ${processType} has been processed (${processID})`,
        bodyMessage: 'Dear User',
        bodyHTML: bodyHTML
        // Add other required fields as needed
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    try {
        await fetch(url, requestOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};