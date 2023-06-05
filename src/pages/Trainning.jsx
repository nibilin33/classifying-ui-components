import { useState, useEffect, useRef } from "react";
import * as ml5 from "ml5";
//[featureExtractor] featureExtractor for images from file https://github.com/ml5js/ml5-library/issues/887
// 一个分类至少要两张照片
export default function Trainning() {
  const version = ml5.version;
  const inputRef = useRef(null);
  const [classifier, setClassifier] = useState(null);
  const [result, setResult] = useState("--");
  const [training, setTraining] = useState(false);
  const [loading, setLoading] = useState(false);
  let currentLabel = "";
  const setup = () => {
    setLoading(true);
    const featureExtractor = ml5.featureExtractor("MobileNet", (e) => {
      setLoading(false);
      if (e?.message) {
        console.log("Model failed", e);
        return;
      }
      console.log("Model Ready");

      setClassifier(featureExtractor.classification());
    });
  };
  useEffect(() => {
    setup();
  }, []);
  function gotResult(e) {
    setResult("--");
    const { target } = e;
    Array.from(target.files).forEach((file) => {
      let img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        classifier.classify(img, (err, result) => {
          console.log("result", result);
          if (err) return;
          setResult(result[0].label);
        });
      };
    });
    inputRef.current.value = null;
  }

  function train() {
    setTraining(true);
    classifier.train((lossValue) => {
      console.log("Loss is", lossValue);
      if (!lossValue) {
        setTraining(false);
      }
    });
  }
  function save() {
    classifier.save();
  }
  function hanldeInput(e) {
    const { target } = e;
    currentLabel = target.value;
  }
  const handleImage = (e) => {
    const { target } = e;
    Array.from(target.files).forEach((file) => {
      let img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        classifier.addImage(img, currentLabel, () => {
          console.log("image added");
        });
      };
    });
  };
  return (
    <>
      <h1>ML5 version:{version} </h1>
      <h4>
        {loading ? "加载中..." : classifier ? "模型加载完成" : "模型加载失败"}
      </h4>
      <label>当前文件打标签</label>
      <input type="text" label="标签" onInput={hanldeInput}></input>
      <input
        type="file"
        accept="image/*"
        onChange={handleImage}
        multiple
      ></input>
      <button onClick={train}>训练</button>
      {training ? <p>训练中...</p> : <p></p>}
      <label>测试识别结果</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={gotResult}
      ></input>
      <p>识别结果:{result}</p>
      <button onClick={save}>保存模型</button>
    </>
  );
}
