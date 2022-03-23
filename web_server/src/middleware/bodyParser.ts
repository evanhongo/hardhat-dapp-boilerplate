import express from "express";

const bodyParser = () => [
  express.text(),
  express.json(),
  express.urlencoded({ extended: true }),
  express.raw(),
];

export default bodyParser;
