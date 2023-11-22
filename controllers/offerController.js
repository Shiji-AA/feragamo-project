const Offer= require('../models/offerModel');




const applyOffer = async (req, res) => {
    try {
        
        const code = req.body.offerCode;
        offerCodes = code;
        const cartTotal = req.body.cartTotal;

       
        const offerFound = await Offer.findOne({});

        if (offerFound) {

            const dateNow = new Date();
            const offerStartFrom = offerFound.startFrom;
            const offerExpiry = offerFound.expiry;

            // Check if the current date is within the offer validity period
            if (dateNow >= offerStartFrom && dateNow <= offerExpiry) {
                if (cartTotal >= offerFound.minimumAmount) {
                    let offerAmount = Math.ceil(cartTotal * (offerFound.offerDiscount / 100));
                    if (offerAmount > offerFound.maximumAmount) {
                        offerAmount = offerFound.maximumAmount;
                    }
                    let amountTotal = cartTotal - offerAmount;
                    res.json({ amountTotal: amountTotal, offerAmount: offerAmount });
                } else {



                    res.json({ minimumValid: "Minimum purchase amount should be maintained" });
                }
            } else {
                res.json({ expiry: "Offer Not Available" });
            }
        } else {
            res.json({ noOffer: "Offer Not Available" });
        }
    } catch (error) {
        console.log(error);
    }
};






module.exports = {

    applyOffer,

}