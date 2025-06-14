import React from "react";
import { FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import AddressForm from "./AddressForm";
import OrderFormData from "./OrderFormData";
import PaymentForm from "./PaymentForm";
function StepForm() {
  const { step } = useSelector((state) => state.form);

  const steps = [
    {
      id: 1,
      title: "Address",
    },
    { id: 2, title: "Summary" },

    { id: 3, title: "Payment" },
  ];
  // console.log("form step is ", step);
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 mt-10">
      {/* Step Indicators */}
      <div className="relative mb-2 flex w-full justify-center">
        {steps.map((stepForm, index) => (
          <div key={index} className="flex flex-col items-center ml-10">
            <button
              className={`
              flex cursor-default aspect-square w-[34px] rounded-full align-baseline items-center justify-evenly text-center
              ${
                step === stepForm.id
                  ? "border-yellow-500 bg-yellow-500 text-white"
                  : "border-gray-500 bg-gray-500 text-gray-300"
              }
              ${step > stepForm.id && "bg-yellow-500 text-white"}
            `}
            >
              {step > stepForm.id ? (
                <FaCheck className="font-bold" />
              ) : (
                stepForm.id
              )}
            </button>
            {/* Dashed line between steps */}
            {stepForm.id !== steps.length && (
              <div className="flex items-center justify-center mt-2">
                <div
                  className={`w-full border-dashed border-b-2 ${
                    step > stepForm.id ? "border-yellow-500 bg-red-800" : "border-gray-500 bg-blue-800"
                  }`}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step Titles */}
      <div className="relative mb-16 flex w-full select-none justify-between">
        {steps.map((item) => (
          <div
            key={item.id}
            className="flex min-w-[130px] flex-col items-center gap-y-2"
          >
            <p
              className={`text-xl ${
                step >= item.id ? "text-yellow-500" : "text-gray-500"
              }`}
            >
              {item.title} <span className="text-pink-500 text-xl">*</span>
            </p>
          </div>
        ))}
      </div>

      {step === 1 && <AddressForm />}
      {step === 2 && <OrderFormData />}
      {step === 3 && <PaymentForm />}
    </div>
  );
}

export default StepForm;
