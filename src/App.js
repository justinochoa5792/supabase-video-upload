import { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Row, Col, Card } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_URL,
  process.env.REACT_APP_KEY
);

function App() {
  const [videos, setVideos] = useState([]);

  const getVideos = async () => {
    const { data, error } = await supabase.storage.from("videos").list("");

    if (data !== null) {
      setVideos(data);
    } else {
      console.log(error);
      alert("Error getting videos");
    }
  };

  useEffect(() => {
    getVideos();
  }, []);

  const uploadFile = async (e) => {
    const videoFile = e.target.files[0];
    const { error } = await supabase.storage
      .from("videos")
      .upload(uuidv4() + ".mp4", videoFile);

    if (error) {
      console.log(error);
      alert("Error Uploading File");
    }
    getVideos();
  };

  return (
    <Container className="mt-5" style={{ width: "700px" }}>
      <h1>Video Feed</h1>
      <Form.Group className="mb-3 mt-3">
        <Form.Label>Upload Your Video Here!</Form.Label>
        <Form.Control
          type="file"
          accept="video/mp4"
          onChange={(e) => uploadFile(e)}
        />
      </Form.Group>
      <Row xs={1} className="g-4">
        {videos.map((el, i) => {
          return (
            <Col key={i}>
              <Card>
                <video height="300px" controls>
                  <source
                    src={process.env.REACT_APP_CDN + el.name}
                    type="video/mp4"
                  />
                </video>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default App;
