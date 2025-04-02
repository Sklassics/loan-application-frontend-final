// import { NextApiRequest, NextApiResponse } from "next";

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   try {
//     const { amount, accountNumber, ifscCode, accountHolderName, tenure } = req.body;

//     // Basic validation (backend should also validate)
//     if (!amount || amount < 10000 || amount > 500000) {
//       return res.status(400).json({ message: "Invalid amount range" });
//     }

//     // Simulate bank processing (In real apps, integrate payment APIs here)
//     const isSuccessful = Math.random() > 0.2; // 80% success rate for demo

//     if (!isSuccessful) {
//       return res.status(500).json({ message: "Bank processing failed. Try again." });
//     }

//     // Success response
//     return res.status(200).json({ success: true, message: "Withdrawal successful!" });
//   } catch (error) {
//     return res.status(500).json({ message: "Server error, please try again." });
//   }
// }
