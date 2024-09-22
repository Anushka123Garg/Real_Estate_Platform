import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id); //listing exists or not

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Lisitng not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only edit your own listings!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Lisitng not found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }
    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }
    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }
    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }
    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

// export const processPayment = async (req, res, next) => {
//   console.log("entered process payment",req.body);
//   try {
//     const { listingId, price } = req.body;
    
//     // Find the listing
//     const listing = await Listing.findById(listingId);

//     if (!listing) {
//       return next(errorHandler(404, "Listing not found!"));
//     }
//     // console.log("ref ",listing.userRef.toString())
//     // console.log("userId ",currentUser._id.toString())
//     if (listing.userRef.toString() === req.user._id.toString()) {
//       return res.status(403).json({ success: false, message: 'Cannot purchase your own listing' });
//     }
//     console.log("no  error ");
//     const session = await stripe.checkout.sessions.create({
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: `Listing Payment for ${listingId}`,
//             },
//             unit_amount: price * 100, // Convert dollars to cents
//           },
//           quantity: 1,
//         },
//       ],
//       payment_method_types: ["card"],
//       mode: "payment",
//       success_url: "http://localhost:5173/success",
//       cancel_url: "http://localhost:5173/cancel",
//     });

//     console.log("done")

//     res.status(200).json({ id: session.id });
//   } catch (error) {
//     console.error("Error creating Stripe session: ", error);
//     if (!res.headersSent) 
//       res.status(500).json({ success: false, message: 'Internal server error' });
//     // next(error);
//   }
// };
