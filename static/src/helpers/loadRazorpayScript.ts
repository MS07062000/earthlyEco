export const loadScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isScriptLoaded("https://checkout.razorpay.com/v1/checkout.js")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      script.setAttribute("scriptLoaded", "true");
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

function isScriptLoaded(scriptSrc: string) {
  return Array.from(document.getElementsByTagName("script")).some(
    (script) =>
      script.src === scriptSrc && script.getAttribute("scriptLoaded") === "true"
  );
}