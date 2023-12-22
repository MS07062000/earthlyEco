export const proceedForPayment = (orderID) => {
    return new Promise((resolve, reject) => {
        const options = {
            "key": import.meta.env.VITE_RAZORPAY_KEY_ID,
            "order_id": orderID,
            "name": "Earthly Eco",
            "image": "https://firebasestorage.googleapis.com/v0/b/maniecommercestore.appspot.com/o/Logo%2FEarthly%20Eco%20Shop.png?alt=media&token=3f3432a6-4d4a-4295-872b-bf302d3e65fa",
            "handler": async function (response) {
                resolve(true);
                // console.log(JSON.stringify(response));
            },
            "theme": {
                "color": "#FDD35B"
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
        rzp1.on('payment.failed', function (response) {
            reject(false);
            // console.log(JSON.stringify(response));
        });
    });
}