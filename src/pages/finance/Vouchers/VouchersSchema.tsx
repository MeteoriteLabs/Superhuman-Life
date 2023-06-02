
import FlatDiscount from "./FlatDiscount";
import DiscountPercentage from "./DiscountPercentage";

export const widgets = {
  discountPercentage: DiscountPercentage,
  flatDiscount: FlatDiscount
};

export const schema: any = {
  voucher_name: {
    'ui:placeholder': 'Enter voucher name'
  },
  percentage_discount: {
    'ui:widget': 'discountPercentage'
  },
  flat_discount: {
    'ui:widget': 'flatDiscount'
  },
  Start_date: {
    'ui:placeholder': 'Select start date'
  },
  expiry_date: {
    'ui:placeholder': 'Select expiry date'
  },
  Usage_restriction: {
    'ui:placeholder': 'Enter usage limit'
  },
  discount: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true
    },
  },

};
