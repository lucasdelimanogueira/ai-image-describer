import { useState } from "react";
import axios from "axios";

const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL;
const STATUS_URL = import.meta.env.VITE_STATUS_URL

export default function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState(null);
  const [polling, setPolling] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResponse(null);
    setError(null);
    setDescription(null);
  
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const pollStatus = async (jobId) => {
    setPolling(true);
    try {
      const res = await axios.get(`${STATUS_URL}/${jobId}`);
      const data = res.data;

      if (data.status === "COMPLETED") {
        setDescription(data.description || "No description available");
        setPolling(false);
        return;
      } else if (data.status === "FAILED") {
        setError("Processing failed");
        setPolling(false);
        return;
      } else {
        // status ainda é PENDING ou PROCESSING, tenta de novo em 3s
        setTimeout(() => pollStatus(jobId), 3000);
      }
    } catch (err) {
      setError("Error polling job status");
      setPolling(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image!");

    setUploading(true);
    setResponse(null);
    setError(null);
    setDescription(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponse(res.data);

      // após o upload, começa a fazer polling pelo status do processamento
      pollStatus(res.data.jobId);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-800 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Upload your Image
        </h1>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                     file:rounded-lg file:border-0
                     file:text-sm file:font-semibold
                     file:bg-indigo-50 file:text-indigo-700
                     hover:file:bg-indigo-100
                     cursor-pointer mb-6"
        />

        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-colors
            ${uploading || !file ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>

        {response && (
          <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded text-green-800">
            <p className="font-semibold mb-2">Upload successful!</p>
            <p><span className="font-medium">Job ID:</span> {response.jobId}</p>
          </div>
        )}
        {previewUrl && (
          <div className="mt-6 flex justify-center">
            <img
              src={previewUrl}
              alt="Uploaded preview"
              className="max-w-full max-h-64 rounded-lg shadow-md"
            />
          </div>
        )}
        {polling && (
          <div className="mt-4 text-blue-600 font-semibold">
            Processing image, please wait...
          </div>
        )}

        {description && (
          <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 rounded text-yellow-800">
            <p className="font-semibold mb-2">Image Description:</p>
            <p>{description}</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 rounded text-red-800">
            <p><span className="font-semibold">Error:</span> {error}</p>
          </div>
        )}
      </div>
    </main>
  );
}