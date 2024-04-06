import { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip, Cell, Label } from "recharts";

const ChartComponent = () => {
  const [data, setData] = useState(null);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    fetch("http://localhost:5000/explore")
      .then((response) => response.json())
      .then((data) => {
        const countryData = Object.entries(data.mean_salary_by_country).map(
          ([country, salary]) => ({
            name: country,
            value: parseFloat(salary),
          })
        );
        setData(countryData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  console.log(data);
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,

    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    const { name } = data[index]; // Get the country name from data

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${name}  `}
      </text>
    );
  };

  return (
    <>
      <div className="chartComponent">
        <PieChart width={600} height={600}>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={300}
            fill="#8884d8"
            label={renderCustomizedLabel}
          />
          {data &&
            data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          <Label value="US" position="center" fill="#000" fontSize={16} />
          <Tooltip />
        </PieChart>
      </div>
      {/* <div>
        {data && (
          <div>
            <h1>Number of Data from Different Countries</h1>
            <ul>
              {Object.entries(data.countries).map(([country, count]) => (
                <li key={country}>
                  {country}: {count}
                </li>
              ))}
            </ul>

            <h1>Mean Salary Based On Country</h1>
            <ul>
              {Object.entries(data.mean_salary_by_country).map(
                ([country, salary]) => (
                  <li key={country}>
                    {country}: {salary}
                  </li>
                )
              )}
            </ul>

            <h1>Mean Salary Based On Experience</h1>
            <ul>
              {Object.entries(data.mean_salary_by_experience).map(
                ([experience, salary]) => (
                  <li key={experience}>
                    {experience}: {salary}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div> */}
    </>
  );
};

export default ChartComponent;
