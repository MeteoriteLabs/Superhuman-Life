export const templateData = [
  {
    label: "Intro Page",
    image: "assets/website_images/checked.svg",
    id: 1,
  },
  // {
  //   label: "Intro Page",
  //   image: "assets/website_images/checked.svg",
  //   id: 2,
  // },
  // {
  //   label: "About",
  //   image: "assets/website_images/checked.svg",
  //   id: 3,
  // },
  // {
  //   label: "Experience / Packages",
  //   image: "assets/website_images/checked.svg",
  //   id: 4,
  // },
];

/*{
    "type": "object",
    "properties": {
  
      "file": {
        "type": "string",
        "format": "data-url",
        "title": "Logo Image"
      },
      "headingOnImage": {
        "type": "string",
        "title": "Heading On Image",
        "minLength": 10,
        "maxLength": 24
      },
      "buttonName": {
        "type": "string",
        "title": "Button Name",
        "minLength": 3,
        "maxLength": 12
      },
      "files": {
        "type": "array",
        "title": "Carousel Images",
        "items": {
          "type": "string",
          "format": "data-url"
        }
      }
    }
  }

ui-schema
{
    "headingOnImage": {
      "ui:widget": "textarea"
    },
    "buttonName": {
      "ui:autofocus": true,
      "ui:emptyValue": ""
    }
   
  }
*/

/*
{
    "type": "object",
    "properties": {
      "files": {
        "type": "array",
        "title": "Three Images",
        "items": {
          "type": "string",
          "format": "data-url"
        }
      },
  
      
      "heading": {
        "type": "string",
        "title": "Heading Text",
        "minLength": 3,
        "maxLength": 12
      },
      "textArea": {
        "type": "string",
        "title": "Text Area",
        "minLength": 10,
        "maxLength": 24
      }
      
    }
  }
*/

//Why choose us

/**
 * 
 * {
    "type": "object",
    "properties": {
      "heading": {
        "type": "string",
        "title": "Heading",
        "minLength": 3,
        "maxLength": 12
      },

      "textArea": {
        "type": "string",
        "title": "Text Area",
        "minLength": 10,
        "maxLength": 24
      },
      "studentNumber": {
        "type": "number",
        "title": "Number of Students"
      },
      "totalExperience": {
        "type": "number",
        "title": "Total Number of Experience"
      },
      "file": {
        "type": "string",
        "format": "data-url",
        "title": "Logo Image"
      }
      
    }
  }

  //UI SCHEMA
  {
  "textArea": {
        "ui-widget": "textarea"
      }
}
 */

//Our Gallery

/**
 * 
 * {
    "type": "object",
    "properties": {
      
     
      "file": {
        "type": "string",
        "format": "data-url",
        "title": "Logo Image"
      }
      
    }
  }
 */

//Enjoy all aspects of Yoga

/**
   * {
    "type": "object",
    "properties": {
      "heading": {
        "title": "Heading",
        "type": "string",
        "minLength": 10,
        "maxLength": 24
      },
        "files": {
        "type": "array",
        "title": "Card Images",
        "items": {
          "type": "string",
          "format": "data-url"
        }
      },
      "nestedHeadingList": {
        "type": "array",
        "title": "Card Heading",
        "items": {
          "type": "string",
          "title": "Heading",
          "default": "Asana"
        }
      },
       "nestedTextList": {
        "type": "array",
        "title": "Card Text",
        "items": {
          "type": "string",
          
          "default": "Type your text here"
        }
      }
      
    }
  }

  //Ui-schema

  {
  "nestedTextList": {
         "ui:widget": "textarea"
      }
}
   */
