import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { Button } from "antd";
import axios from "axios";
import "./ProductDetails.css";
import LayoutApp from "../../components/Layout/Layout";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await axios.get(`/api/products/getproducts/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (!product) {
    return <h4 className='text-center pt-5'>Loading...</h4>;
  }

  const { name, description, image, price } = product;

  return (
    <LayoutApp>
      <section>
        <Container>
          <Row>
            <Col lg='8'>
              <div className='product-content'>
                <h2 style={{ marginBottom: "20px" }}>Detalii produs</h2>
                <img src={image} alt={name} className='product-image' />
                <h2>{name}</h2>
                <h4>€{price}</h4>
                <p>{description}</p>
              </div>
              <div style={{ marginTop: "20px" }}>
                <Button type='default' onClick={() => navigate("/")}>
                  Înapoi
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </LayoutApp>
  );
};
export default ProductDetails;
