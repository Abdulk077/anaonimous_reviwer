import http from "k6/http";
import { sleep } from "k6";

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: "constant-arrival-rate",
      rate: 400, // Target: Exactly 200 requests per second (Doubled!)
      timeUnit: "1s",
      duration: "20s",
      preAllocatedVUs: 1000, // Increased to ensure k6 has enough workers
      maxVUs: 1000,
    },
  },
};

export default function () {
  http.get("http://127.0.0.1:3000/api/posts/");
}
