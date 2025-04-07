
"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";
import router from "next/router";

const agreementSchema = z.object({
  signature: z.string().min(1, "Signature is required"),
});

type AgreementFormValues = z.infer<typeof agreementSchema>;


const AgreementComponent = () => {
  const [agreementData, setAgreementData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sigCanvasRef = useRef<any>(null);
  const { setValue, handleSubmit } = useForm<AgreementFormValues>({
    resolver: zodResolver(agreementSchema),
  });
  

  useEffect(() => {
    const fetchAgreementData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("auth_token");
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/pdf`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAgreementData(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to fetch agreement data");
      } finally {
        setLoading(false);
      }
    };

    fetchAgreementData();
  }, []);

  const onSubmit = async (values: AgreementFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("auth_token");
      const payload = {
        ...agreementData,
        signature: values.signature,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/pdf`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Agreement saved successfully");
      router.push("/success");
    } catch (err: any) {
      console.error("Error saving agreement:", err);
      setError(err.response?.data?.message || err.message || "Error saving agreement");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
    }
    setValue("signature", "");
  };

  const handleEnd = () => {
    if (sigCanvasRef.current) {
      const dataURL = sigCanvasRef.current.getTrimmedCanvas().toDataURL("image/png");
      setValue("signature", dataURL);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <>
    <div className="max-w- mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
    <h1 className="text-2xl font-bold mb-4">Loan Agreement</h1>

    {agreementData && (
      <>
        <table className="w-full table-auto border mb-6 text-sm">
          <tbody className="divide-y">
            <tr><td className="font-semibold p-2 w-1/3">Name of the Borrower</td><td className="p-2">{agreementData?.personalDetails?.name}</td></tr>
            <tr><td className="font-semibold p-2">Address</td><td className="p-2">{agreementData?.personalDetails?.address}</td></tr>
            <tr><td className="font-semibold p-2">Email</td><td className="p-2">{agreementData?.mobileDetails?.email}</td></tr>
            <tr><td className="font-semibold p-2">Mobile</td><td className="p-2">{agreementData?.mobileDetails?.mobileNumber}</td></tr>
            <tr><td className="font-semibold p-2">Loan Amount</td><td className="p-2">₹{agreementData?.masterDetails?.amount}</td></tr>
            <tr><td className="font-semibold p-2">Interest Rate</td><td className="p-2">{agreementData?.masterDetails?.interestRate}%</td></tr>
            <tr><td className="font-semibold p-2">Loan Tenure</td><td className="p-2">{agreementData?.masterDetails?.loanTenure} month(s)</td></tr>
            <tr><td className="font-semibold p-2">Total Repayable</td><td className="p-2">₹{agreementData?.totalrepayableamount}</td></tr>
            <tr><td className="font-semibold p-2">Processing Fee</td><td className="p-2">₹{agreementData?.processingfee}</td></tr>
            <tr><td className="font-semibold p-2">Insurance Charges</td><td className="p-2">₹{agreementData?.insurancecharges}</td></tr>
          </tbody>
        </table>

        <div className="overflow-x-auto">
          <h2 className="text-lg font-semibold mb-2">Repayment Schedule</h2>
          <table className="w-full table-auto border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Installment</th>
                <th className="border px-4 py-2">Repayment Date</th>
                <th className="border px-4 py-2">Principal</th>
                <th className="border px-4 py-2">Interest</th>
                <th className="border px-4 py-2">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {agreementData?.repaymentSchedules?.map((repayment: any, index: number) => (
                <tr key={index}>
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2">{repayment?.repaymentdate}</td>
                  <td className="border px-4 py-2">₹{repayment?.principalamount}</td>
                  <td className="border px-4 py-2">₹{repayment?.interest}</td>
                  <td className="border px-4 py-2">₹{repayment?.repayableamount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )}

    {/* Signature Form */}
   
    </div>
    <div className="text-black font-sans text-sm">
    
      <div className="max-w-full mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Terms & Conditions</h1>
        <p>
          * A period provided to borrowers as an explicit option to exit from loan by paying the
          principal amount and the proportionate APR without charging any penalty during this period.
          During the look-up period, the borrower has the option to foreclose the loan by paying the
          complete Loan Amount. In case of repayment during the look-up period the proportionate APR
          up to the time of repayment, including processing fee, shall be charged to the borrower.
          The lock-in amount of ₹0 shall not be available to the borrower for such pre-payments made
          within the look-up period.
        </p>
        <ul className="list-disc ml-6 my-4">
          <li>BORROWER CAN RAISE THEIR GRIEVANCE BY WRITING TO SUPPORT@XPMKTECH.COM</li>
          <li>BORROWER CAN ALSO REFER TO LINK FOR THE GRIEVANCE REDRESSAL POLICY</li>
          <li>
          For the purpose of undertaking collection and recovery the Lender either on its own or through 
the lending service provider (including its agents etc.), undertake collection or recovery from the 
Borrower. For details of service provider and its agents etc. please refer to “LSPs- DLAs DETAILS” 
. The Privacy Policy of the Company and LSP/DLA can be viewed at “MFSPLPRIVACY POLICY” and 
Policy- LSP & DLAs” . 
All charges will be deducted from the disbursal amount.
          </li>
        </ul>

        <h2 className="text-xl font-semibold my-2"> I acknowledge that:</h2>
        <ol className="list-decimal ml-6 mb-4">
          <li>
            These are the Most Important Terms & Conditions of the aforesaid Loan, and all other
            terms and conditions of the Loan shall be as specified in the Loan Agreement.
          </li>
          <li>
            I hereby request the Lenders to debit Rs.80/- only from Loan and pay insurer/ vendor
            towards insurance premium/ sale price of product / service.
          </li>
          <li>
            I am well aware of the features and Terms & conditions of the insurance/ product /
            service and voluntarily availed/ purchased the same on my own. Hence, I will not hold the
            Lenders and/or Lending Service Provider responsible for any defect/service
            deficiency/rejection of claim/warranty by the insurer/vendor of product/ service.
          </li>
          <li>
            I hereby provide my explicit consent to share my personal details/KYC information to the
            insurer/vendor of product/ service, as required, for granting the said insurance/service/product.
          </li>
          <li>
            The Lenders, at its sole discretion, shall be entitled to revoke this sanction upon
            occurrence of any of the following events:
            <ul className="list-disc ml-6">
              <li>There is any material change in the purpose for which the Loan has been sanctioned.</li>
              <li>
                Any statement, declaration, undertaking or disclosure made by, or on behalf of, the
                Borrower/Customer in the application or otherwise is incorrect, inaccurate,
                incomplete or misleading.
              </li>
              <li>
                If there is a default or a breach of the terms and conditions of this Sanction Letter
                or the other terms of the loan.
              </li>
              <li>
                If there is any bankruptcy or insolvency proceeding filed or admitted against the
                Borrower/Customer.
              </li>
              <li>
                Relevant documents are not executed by the Borrower as per Lender's policy and
                requirements.
              </li>
            </ul>
          </li>
        </ol>

        <h2 className="text-xl font-semibold my-2">Prepayment Terms</h2>
        <p>
          The Borrower may prepay, in whole the outstanding amount of the facility at any time during
          the loan tenure, subject to the payment of a prepayment fee. It is further acknowledged
          that any instalment due within the next 30 days, payment before the due date will not be
          considered to be a prepayment and there will be no waiver of interest on such prepayment
          before due date.
        </p>
      </div>

      <div className="max-w-full mx-auto p-6 bg-white shadow-md rounded-md">
       
        <p className="mb-4">
        6. The Borrower may prepay, in whole the outstanding amount of the facility at any time during 
the loan tenure, subject to the payment of a prepayment fee. It is further acknowledged that 
for any instalment due within the next 30 days, payment before the due date will not be 
considered to be a prepayment and there will be no waiver of interest on such repayment 
before due date. In case the borrower opts to prepay any instalment (other than an 
instalment due within the next 30 days) a prepayment fee shall be charged to the borrower. 
Such prepayment fee (inclusive of GST) shall be calculated as the minimum value between (i) 
the interest amount due for the prepaid instalments and (ii) the maximum of (a) 70% of the 
7. 
interest amount due for the prepaid instalments and (b) 5% of sum of all the balance 
instalments to be prepaid plus GST
        </p>
        <p className="mb-4">
          7. The Borrower hereby understands that identical products with identical tenor and availed 
during the same period may attract different interest rates. Interest rates could vary 
depending upon consideration of all or combination of multiple factors including but not 
limited to the following: Historical performance of similar homogeneous clients; Profile of the 
applicant; Repayment track record of the applicant; Unsecured loan; Loan ticket size; Credit 
rating of the applicant; Loan tenor; Location delinquency and collection performance; Other 
indebtedness of the applicant
        </p>
        <p className="mb-4">
          8.The Borrower understands that the Lender has adopted risk-based pricing, which is arrived 
by considering, broad parameters like the borrowers financial and credit risk profile. Hence, 
the rates of Interest will be different for different categories of borrowers based on the 
Interest rate model disclosed in the Interest Rate Policy on the Lender''s website available at
          <a href="#" className="text-blue-500 underline">Interest Rate Policy</a>.
        </p>
        <p className="mb-4">9. The Borrower declares that he/she is aware that the Sanction Letter and other incidental 
documents executed by him/her integrate all the conditions mentioned herein or incidental 
thereto, and supersede all negotiations or prior writings, except for those provisions specified 
herein. The sanction of the abovementioned Loan and all the terms and conditions 
mentioned in this Sanction Letter are subject to the execution of the digitally signed click
wrap Loan Agreement ("Loan Documents") as Lender may specify in the prescribed formats. 
This Sanction Letter intends to summarize certain basic terms of the Loan and the Loan 
Agreement and does not reflect the complete agreement between the Lender and the 
Borrower in relation to the Loan. </p>
        <p className="mb-4">10.  This Sanction Letter intends to summarize certain basic terms of the Loan and does not 
reflect the complete agreement between the Lender and the Borrower in relation to the 
Loan. The Loan Documents shall contain additional terms and conditions which have not 
been set out in this Sanction Letter and the Loan Documents shall be read together with the 
terms and conditions specified in this Sanction Letter. </p>
        <p className="mb-4">11. I hereby further confirm that I understand English Language and agree that all the loan 
documents, T&C and other related documents and future communication are to be sent in 
English Language. If I have specified a preferred language other than English, I understand 
that all documents will be sent to me in the preferred language as well.</p>
        <p className="mb-4">12. Disclosure: As a precondition to the Loan to be granted to the Borrower by the Lender, the 
Borrower by accepting this Sanction Letter authorizes, consents and agrees for the disclosure 
and sharing by the Lender of all or any information and data relating to the Borrower to the 
Reserve Bank of India ("RBI") and/or to the Credit Information Companies (CIC) and/or to any 
other agency authorized in this behalf by RBI / CIC, to the Lender''s professional advisers and 
consultants, to its affiliates/ subsidiaries, agents, and to its service providers. In case of 
default in the repayment of 
the loan/advances/interest on due dates, Lender and/or the RBI / CIC will have an unqualified 
right to disclose or publish the name of the Borrower and its directors / partners as defaulter 
in such manner and through such medium as Lender or the RBI in their absolute discretion 
may think fit. </p>
        <p className="mb-4">13. The Borrower shall notify the Lender in writing no later than 7 days of all changes in the 
        location/address of office/residence/place of studying/place of business. </p>
        <p className="mb-4">14. Confidentiality: The Sanction Letter and its content are intended for the exclusive use of the 
Borrower and shall not be disclosed by the Borrower to any person other than the Borrower's 
legal advisors for the purposes of the proposed transaction unless the prior written consent 
of the Lender is obtained.</p>
        <p className="mb-4">15. Representations and Warranties: Usual and customary for transactions of this nature, 
including but not limited to maintenance of existence; notices of default, material litigation; 
compliance with applicable laws and decrees; payment of taxes; maintenance and insurance. 
For the classification of a loan account as Special Mention Accounts (SMA)/ Non-Performing 
Asset (NPA) the following principle is applicable as on the date of this Sanction Letter and all 
dates mentioned here-in are for illustration purpose. 
If there is a default in making payment of Principal or interest or any other amount wholly or 
partly levied by the Company on or before due date, then such overdue loan account shall be 
classified as SMA (Special Mention account) or NPA (Non-performing asset) as per RBI regulations 
as indicated in below table:</p>
        <p className="mb-4">16. Confidentiality: The contents of this letter are exclusive...</p>
        <p className="mb-4">17. Inspections and Warranties...</p>
        <p>18. For classification of a loan account as Special Mention Accounts (SMA)...</p>
      </div>

      <div className="bg-white px-10 py-12 max-w-full mx-auto">
        <p className="mb-4">
          If there is a default in making payment... classified as SMA (Special Mention account) or
          NPA (Non-performing asset) as per RBI regulations...
        </p>

        <table className="w-full text-left border border-black mb-6">
          <thead>
            <tr>
              <th className="border border-black px-3 py-2">Overdue</th>
              <th className="border border-black px-3 py-2">Classification</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black px-3 py-2">For a period up to 30 days</td>
              <td className="border border-black px-3 py-2">SMA-0</td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-2">More than 30 days and up to 60 days</td>
              <td className="border border-black px-3 py-2">SMA-1</td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-2">More than 60 days and up to 90 days</td>
              <td className="border border-black px-3 py-2">SMA-2</td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-2">More than 90 days</td>
              <td className="border border-black px-3 py-2">NPA*</td>
            </tr>
          </tbody>
        </table>

        <p className="mb-4 text-xs">*Upgradation of accounts classified as NPAs</p>
        <p className="mb-4">
          Loan account once classified as NPA can be upgraded... paid by the borrower.
        </p>
        <p className="mb-4 font-semibold">Illustration:</p>
        <p className="mb-4">
          If due date of a Loan account repayment is March 31, 202X, and full dues are not received...
        </p>
        <p className="mb-4">
          Tagged as SMA-1 on April 30, 202X → SMA-2 on May 30, 202X → NPA on June 30, 202X.
        </p>

        <p className="mb-4">
          Please note that this communication should not be construed as giving rise to any obligation...
        </p>

        <p className="mb-6">We look forward to your availing of the sanctioned loan and assure you our best service always.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-full mx-auto p-6 bg-white mt-6 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold mb-4">Your Signature</h2>

  <div className="border border-gray-300 rounded-md mb-4">
    <SignatureCanvas
      penColor="black"
      canvasProps={{ width: 500, height: 200, className: "w-full h-48 bg-gray-100 rounded" }}
      ref={sigCanvasRef}
      onEnd={handleEnd}
    />
  </div>

  <div className="flex justify-between items-center mb-4">
    <button
      type="button"
      onClick={handleClear}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Clear Signature
    </button>

    <button
      type="submit"
      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Submit Agreement
    </button>
  </div>

  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
</form>

        <p className="mb-1 font-semibold">Thanking You,</p>
        <p className="mb-6 font-semibold">For Sklassics Financial Services Private Limited</p>

        {/* <p className="mb-2">
          <Link href="/digital-sign" role="img" aria-label="signature" className="text-blue-600">📄 Digitally Signed</Link>
        </p> */}
        {/* <p className="mb-6 text-xs">Digitally Signed by Sklassics Financial Services Private Limited</p>
        <p className="mb-1 text-xs">Date: 25/02/2025, 18:58:22</p> */}
{/* 
        <div className="border-t border-black pt-4 mt-6 text-xs">
          <p>CIN: U65990WB1997PTC123108 &nbsp;&nbsp;&nbsp; GST: 19AAHCM4289P1ZO</p>
          <p>Registered Office: P1-Silver Corporate Park, 13th Floor, Tower-1, Plot-C, Sector No. 125, GN Block, Sector V, Kolkata - 700091, India</p>
          <p>Phone: 033 6645 2400 Email: support@mpokket.com Website: www.mpokket.in</p>
        </div> */}
{/* 
        <button
          onClick={handleDownloadAndSend}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download
        </button> */}
        
      </div>
    </div>
  </>
  );
} 