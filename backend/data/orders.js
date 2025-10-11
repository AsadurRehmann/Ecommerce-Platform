const orders=[
    {
  "user": "6708c8d4b3b1d2a55f0a1111",
  "orderItems": [
    {
      "productId": "6708c9c6b3b1d2a55f0a1234",
      "name": "Wireless Bluetooth Headphones",
      "image": "https://example.com/images/headphones.jpg",
      "price": 3500,
      "size": "Standard",
      "color": "Black",
      "quantity": 1
    },
    {
      "productId": "6708c9c6b3b1d2a55f0a5678",
      "name": "Mechanical Keyboard RGB",
      "image": "https://example.com/images/keyboard.jpg",
      "price": 7200,
      "size": "Full",
      "color": "White",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "address": "House 14, Street 9, Model Town",
    "city": "Lahore",
    "postalCode": "54000",
    "country": "Pakistan",
    "phone": "+923001234567"
  },
  "paymentMethod": "Cash on Delivery",
  "totalPrice": 10700,
  "isPaid": false,
  "paymentStatus": "pending",
  "isDelivered": false,
  "status": "Processing"
}
]

module.exports=orders;