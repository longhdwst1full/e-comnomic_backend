import Razorpay from "razorpay";

const instance = new Razorpay({
    key_id: "2223",
    key_secret: "232322323"
})

const checkout = async (req, res) => {
    const options = {
        amount: 50000,
        currency: "INR"
    }
    const order = await instance.orders.create(options)
    res.json({
        success: true,
        order,
    })
}


const paymentVerification = async (req, res) => {

    res.json({
        razorpayOrderId: req.body.razorpayOrderId,
        razorpayPaymentId: req.body.razorpayPaymentId
    })
}

export { checkout, paymentVerification }