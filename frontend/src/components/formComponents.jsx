import { useState } from "react";

const FormComponent = () => {
  const [formData, setFormData] = useState({
    country: "",
    education: "Less than a Bachelors",
    experience: 0,
  });
  const [salaryOutput, setSalaryOutput] = useState(null); // State to hold the salary output

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const jsonData = JSON.stringify(formData);
    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      });
      const data = await response.json();
      console.log(data);
      setSalaryOutput(data.salary); // Update salary output with the predicted salary
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Country:
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Education Level:
          <select
            name="education"
            value={formData.education}
            onChange={handleChange}
          >
            <option value="Less than a Bachelors">Less than a Bachelors</option>
            <option value="Bachelor’s degree">Bachelor’s degree</option>
            <option value="Master’s degree">Master’s degree</option>
            <option value="Post grad">Post grad</option>
          </select>
        </label>
        <br />
        <label>
          Years of Experience:
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      {salaryOutput !== null && <h3>Salary Output: {salaryOutput}</h3>}
    </div>
  );
};

export default FormComponent;
