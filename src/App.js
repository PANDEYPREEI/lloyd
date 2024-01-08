import "./App.css";
import lunch from "./lunchbg.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion"; // index.js or App.js or any other component file
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  let options = [];
  const [data, setData] = useState([]);
  const [date, setDate] = useState("");
  const [error, setError] = useState(null);
  const carouse = [
    "Cooking gone wrong ? ",
    "Order your food",
    "Delicious food",
  ];
  const marked = "Subramani";
  const [isLucnhMark, setLunchMark] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isAlreadyMarked, setAlreadyMarked] = useState(false);

  const [currentCarouseIndex, setCurrentCarouseIndex] = useState(0);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const todayFormatted = today.toISOString().split("T")[0]; // toISOString() method is used to convert the Date objects to a string in the ISO format
  const tomorrowFormatted = tomorrow.toISOString().split("T")[0]; // "YYYY-MM-DDTHH:mm:ss.sssZ". split('T')[0] is then used to extract only the date part before the 'T', leaving us with "YYYY-MM-DD"
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    console.log(event.target.value);
  };

  const handleBack = () => {
    setLunchMark(false);
    setSelectedOption("");
    setDate("");
  };

  const handleMarkLunch = async () => {
    if (selectedOption == "") {
      toast.error("Please select name");
      return;
    }
    if (date == "") {
      toast.error("Please select date");
      return;
    }
    console.log(selectedOption, "selectedoption");
    setLunchMark(true);
    console.log(date, selectedOption, "date");

    const req = {
      date: date,
      emp_code: selectedOption,
    };
    console.log(req);
    try {
      const apiUrl = "https://59.152.52.154:8180/data/mark";
      const response = await axios.post(apiUrl, req);
      console.log(response, response.data[0].sp_lunch.value);
      const parsedValue = JSON.parse(response.data[0].sp_lunch.value);
      console.log(parsedValue);
      if (parsedValue.msg == "Lunch marked successfully.") {
        setAlreadyMarked(false);
        toast.success(parsedValue.msg, selectedOption);
      } else if (parsedValue.msg == "Lunch is already marked!") {
        setAlreadyMarked(true);
        toast.warn(parsedValue.msg, selectedOption);
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error);
      setError(error);
    }
  };

  const handleDateChange = (event) => {
    console.log(event.target.value, "date");
    setDate(event.target.value);
  };

  useEffect(() => {
    // Update the statement every 3 seconds
    const intervalId = setInterval(() => {
      setCurrentCarouseIndex((prevIndex) => (prevIndex + 1) % carouse.length);
      console.log(currentCarouseIndex, carouse.length, currentCarouseIndex + 1);
    }, 3000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [carouse.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = "https://59.152.52.154:8180/data";
        const response = await axios.get(apiUrl);
        console.log(response.data);
        setData(response.data);
        options = data;
      } catch (error) {
        console.log(error, "error");
        setError(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      <div>
        {/* Other components */}
        <ToastContainer />
      </div>
      <div className="card">
        <div className="card-body">
          <div className="lg:flex">
            <div className="lg:w-1/2 p-12">
              <div className="row mt-2 mb-3">
                <p className="logo">Annapurna</p>
              </div>
              <div className="row mt-8">
                <p className="carouse-text">{carouse[currentCarouseIndex]}</p>
              </div>
              <div className="row">
                <p className="carouse-sub-text">
                  Order food from your favourite restaurants near your place ?
                </p>
              </div>
              <div>
                {isLucnhMark ? (
                  <>
                    <div className="mt-10">
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          <div className="row mt-2 mb-3">
                            <div className="d-flex col-md-12">
                              <button className="back-btn" onClick={handleBack}>
                                <i
                                  className="mr-2 fa fa-arrow-left back-icon"
                                  aria-hidden="true"
                                ></i>
                                <span className="back-text">Back</span>
                              </button>
                            </div>
                          </div>
                          <div className="marked-lunch-section">
                            {!isAlreadyMarked ? (
                              <div className="p-10">
                                <i className="thumb-icon fas fa-thumbs-up fa-3x"></i>
                                <p className="marked-lunch-text">
                                  Lunch is suceessfully marked for{" "}
                                  <span className="marked-text-color">
                                    {" "}
                                    {selectedOption}
                                  </span>{" "}
                                </p>
                              </div>
                            ) : (
                              <div className="p-10">
                                <i className="fa-regular thumb-icon fa-face-smile-wink fa-3x"></i>
                                <p className="marked-lunch-text">
                                  Lunch is already marked for
                                  <span className="marked-text-color">
                                    {" "}
                                    {selectedOption}
                                  </span>{" "}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="row mt-14">
                      <div className="col-md-6 col-sm-12 col-xs-12">
                        <input
                          className="date-input form-control mb-3"
                          placeholder="select date"
                          type="date"
                          onChange={handleDateChange}
                          value={date}
                          min={todayFormatted}
                          max={tomorrowFormatted}
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 col-xs-12">
                        <select
                          className="dropdown form-control"
                          value={selectedOption}
                          onChange={handleSelectChange}
                        >
                          {/* Map through the options and create option elements */}
                          <option key={"none"} value="">
                            Select Name
                          </option>
                          {data.map((option) => (
                            <>
                              <option
                                key={option.emp_code}
                                value={option.emp_code}
                              >
                                {option.emp_fname} {option.emp_lname}
                              </option>
                            </>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-12 d-flex justify-content-end mt-3">
                        <button
                          className="mark-lunch"
                          onClick={handleMarkLunch}
                        >
                          Mark Lunch
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="lg:w-1/2">
              <img src={lunch} alt="lunch" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
