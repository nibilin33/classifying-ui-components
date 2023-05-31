import { useState, useRef, useEffect } from "react";
import "./App.css";
import * as p5 from "p5";
import * as ml5 from "ml5";
const p5Tool = new p5();
//[featureExtractor] featureExtractor for images from file https://github.com/ml5js/ml5-library/issues/887
// 一个分类至少要两张照片
function App() {
  const version = ml5.version;
  let capture = useRef();
  const [
    classifier,
    setClassifier
  ] = useState(null)
  const [
    result,
    setResult
  ] = useState('--');
  const [
    training,
    setTraining
  ] = useState(false)
  let currentLabel = '';
  function modelReady() {
    console.log("Model Ready");
  }
  const setup = () => {
    capture.current = p5Tool.createCanvas(800, 800);
    const featureExtractor = ml5.featureExtractor(
      "MobileNet",
      // { epochs: 20 },
      modelReady
    );
    setClassifier(featureExtractor.classification())
  };
  useEffect(() => {
    setup();
  }, []);
  function gotResult(e) {
    const { target } = e;
    target.files.forEach((file) => {
      let img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
      	classifier.classify(img, (err, result) => {
          console.log('result', result)
          if(err) return;
          setResult(result[0].label)
        });
      };
    });
	}
	
	function train() {
    setTraining(true)
		classifier.train((lossValue ) => {
		  console.log("Loss is", lossValue);
      if(!lossValue) {
        setTraining(false)
      }
		});
	}
  function hanldeInput(e) {
    const {
      target
    } = e;
    currentLabel = target.value;
  }
  const handleImage = (e) => {
    const { target } = e;
    target.files.forEach((file) => {
      let img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        classifier.addImage(img,currentLabel,()=>{
          console.log("image added");
        });
      };
    });
  };
  return (
    <>
      <div>
        <h1>ML5 version:{version} </h1>
        <label>当前文件打标签</label>
        <input type="text" label="标签" onInput={hanldeInput}></input>
        <input type="file" accept="image/*" onChange={handleImage}></input>
        <button onClick={train}>训练</button>
        {training? <p>训练中...</p> : null}
        <label>测试识别结果</label>
        <input id="result"  type="file" accept="image/*" onChange={gotResult}></input>
        <div>识别结果:{result}</div>
      </div>
    </>
  );
}

export default App;
