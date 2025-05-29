export default async function handler(req, res) {
  const response = await fetch('http://139.59.85.26:5000/api/products');
  const data = await response.json();
  res.status(200).json(data);
} 