import React, { useRef, useState, useEffect, useContext } from 'react';
import { FileContext } from "../pages/ViewImage";

const math = require('mathjs');

const ImageViewer = () => {
  const { file, handleUpload } = useContext(FileContext)
  useEffect(() => {handleImageUpload(file)}, [file])

  const canvasRef = useRef(null);
  const coordinatesRef = useRef(null);
  const [imgObj, setImgObj] = useState({
    img: new Image(),
    affine_mat: eye(3),
    oldX: null,
    oldY: null
  });
  const [imgX, setImgX] = useState(0);
  const [imgY, setImgY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  function eye(n) {
    return [...Array(n)].map((e, i, a) => a.map((e) => +!i--));
  }

  const handleMouseDown = (e) => {
    const mouseX = e.clientX - canvasRef.current.getBoundingClientRect().left;
    const mouseY = e.clientY - canvasRef.current.getBoundingClientRect().top;

    if (
      mouseX >= imgX &&
      mouseX <= imgX + imgObj.img.width &&
      mouseY >= imgY &&
      mouseY <= imgY + imgObj.img.height
    ) {
      setIsDragging(true);
      setOffsetX(mouseX - imgX);
      setOffsetY(mouseY - imgY);
    }
  };

  const handleMouseMove = (e) => {
    const mouseX = e.clientX - canvasRef.current.getBoundingClientRect().left;
    const mouseY = e.clientY - canvasRef.current.getBoundingClientRect().top;

    coordinatesRef.current.textContent = `Mouse X: ${mouseX}, Y: ${mouseY} Client X: ${e.clientX}, Y: ${e.clientY}`;
    imgObj.oldX = e.clientX;
    imgObj.oldY = e.clientY;

    if (
      mouseX < 0 ||
      mouseX > canvasRef.current.width ||
      mouseY < 0 ||
      mouseY > canvasRef.current.height
    ) {
      setIsDragging(false);
    }

    if (isDragging) {
      setImgX(mouseX - offsetX);
      setImgY(mouseY - offsetY);

      const mC = math.matrix([
        [1, 0, e.clientX - imgObj.oldX],
        [0, 1, e.clientY - imgObj.oldY],
        [0, 0, 1],
      ]);

      const ctx = canvasRef.current.getContext('2d');
      ctx.transform(
        mC.get([0, 0]),
        mC.get([1, 0]),
        mC.get([0, 1]),
        mC.get([1, 1]),
        mC.get([0, 2]),
        mC.get([1, 2])
      );
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.restore();
      ctx.drawImage(imgObj.img, imgX, imgY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseWheel = (e) => {
    e.preventDefault();

    const mouseX = e.clientX - canvasRef.current.getBoundingClientRect().left;
    const mouseY = e.clientY - canvasRef.current.getBoundingClientRect().top;
    const delta = e.deltaY;
    const scaleFactor = 1 - delta * 0.001;

    const translate1 = math.matrix([
      [1, 0, -mouseX],
      [0, 1, -mouseY],
      [0, 0, 1],
    ]);
    const scale = math.matrix([
      [scaleFactor, 0, 0],
      [0, scaleFactor, 0],
      [0, 0, 1],
    ]);
    const translate2 = math.matrix([
      [1, 0, mouseX],
      [0, 1, mouseY],
      [0, 0, 1],
    ]);

    const ctx = canvasRef.current.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    imgObj.affine_mat = math.multiply(
      translate2,
      scale,
      translate1,
      imgObj.affine_mat
    );

    ctx.transform(
      imgObj.affine_mat.get([0, 0]),
      imgObj.affine_mat.get([1, 0]),
      imgObj.affine_mat.get([0, 1]),
      imgObj.affine_mat.get([1, 1]),
      imgObj.affine_mat.get([0, 2]),
      imgObj.affine_mat.get([1, 2])
    );

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.restore();

    ctx.drawImage(imgObj.img, 0, 0);
  };

  const handleImageUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(img, 0, 0);
          setImgObj({ img, affine_mat: eye(3), oldX: null, oldY: null });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.addEventListener('wheel', handleMouseWheel);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);

    canvas.addEventListener('mouseenter', () => {
      canvas.style.cursor = 'crosshair';
    });

    canvas.addEventListener('mouseleave', () => {
      canvas.style.cursor = 'default';
    });

    return () => {
      canvas.removeEventListener('wheel', handleMouseWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [imgX, imgY, isDragging, offsetX, offsetY, imgObj.affine_mat]);

  const fileTypes = ["JPG", "PNG", "GIF"];

  return (
    <div>
      <canvas
        ref={canvasRef}
        id="myCanvas"
        width={400}
        height={300}
        style={{ border: '2px solid black' }}
      />
      <div id="coordinates" ref={coordinatesRef} />
    </div>
  );
};

export default ImageViewer;
