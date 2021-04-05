<div id='collection-component-1612801065453'></div>
<script type="text/javascript">
/*<![CDATA[*/
(function () {
  var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
  if (window.ShopifyBuy) {
    if (window.ShopifyBuy.UI) {
      ShopifyBuyInit();
    } else {
      loadScript();
    }
  } else {
    loadScript();
  }
  function loadScript() {
    var script = document.createElement('script');
    script.async = true;
    script.src = scriptURL;
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    script.onload = ShopifyBuyInit;
  }
  function ShopifyBuyInit() {
    var client = ShopifyBuy.buildClient({
      domain: 'ravenridge-family-farm.myshopify.com',
      storefrontAccessToken: 'fd3ff77b195d4c7deead57d3194e96c0',
    });
    ShopifyBuy.UI.onReady(client).then(function (ui) {
      ui.createComponent('collection', {
        id: '239325118619',
        node: document.getElementById('collection-component-1612801065453'),
        moneyFormat: '%24%7B%7Bamount%7D%7D',
        options: {
  "product": {
    "styles": {
      "product": {
        "@media (min-width: 601px)": {
          "max-width": "calc(33.33333% - 30px)",
          "margin-left": "30px",
          "margin-bottom": "50px",
          "width": "calc(33.33333% - 30px)"
        },
        "img": {
          "height": "calc(100% - 15px)",
          "position": "absolute",
          "left": "0",
          "right": "0",
          "top": "0"
        },
        "imgWrapper": {
          "padding-top": "calc(75% + 15px)",
          "position": "relative",
          "height": "0"
        }
      },
      "button": {
        ":hover": {
          "background-color": "#4f622c"
        },
        "background-color": "#586d31",
        ":focus": {
          "background-color": "#4f622c"
        },
        "padding-left": "42px",
        "padding-right": "42px"
      }
    },
    "buttonDestination": "modal",
    "contents": {
      "options": false
    },
    "text": {
      "button": "View product"
    }
  },
  "productSet": {
    "styles": {
      "products": {
        "@media (min-width: 601px)": {
          "margin-left": "-30px"
        }
      }
    }
  },
  "modalProduct": {
    "contents": {
      "img": false,
      "imgWithCarousel": true,
      "button": false,
      "buttonWithQuantity": true
    },
    "styles": {
      "product": {
        "@media (min-width: 601px)": {
          "max-width": "100%",
          "margin-left": "0px",
          "margin-bottom": "0px"
        }
      },
      "button": {
        ":hover": {
          "background-color": "#4f622c"
        },
        "background-color": "#586d31",
        ":focus": {
          "background-color": "#4f622c"
        },
        "padding-left": "42px",
        "padding-right": "42px"
      },
      "price": {
        "font-size": "22px"
      },
      "compareAt": {
        "font-size": "18.7px"
      },
      "unitPrice": {
        "font-size": "18.7px"
      }
    },
    "text": {
      "button": "Add to cart"
    }
  },
  "option": {
    "styles": {
      "label": {
        "color": "#133648"
      }
    }
  },
  "cart": {
    "styles": {
      "button": {
        ":hover": {
          "background-color": "#4f622c"
        },
        "background-color": "#586d31",
        ":focus": {
          "background-color": "#4f622c"
        }
      }
    },
    "text": {
      "title": "Your Order",
      "total": "Subtotal",
      "empty": "If you're here, somebody's hurting, and not just this empty shopping cart.",
      "notice": "Standard shipping included. Taxes added at checkout.",
      "button": "Checkout"
    },
    "popup": false
  },
  "toggle": {
    "styles": {
      "toggle": {
        "background-color": "#586d31",
        ":hover": {
          "background-color": "#4f622c"
        },
        ":focus": {
          "background-color": "#4f622c"
        }
      }
    }
  }
},
      });
    });
  }
})();
/*]]>*/
</script>
