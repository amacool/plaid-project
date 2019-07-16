import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import * as config from "./config";
import WidgetBox from "../WidgetBox";
import connect from "react-redux/es/connect/connect";

let data = {
  labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  datasets: [
    {
      label: "Number of Users",
      data: [350, 456, 404, 590, 705, 970, 340, 800, 400, 350, 900, 780],
      borderColor: "rgb(54, 162, 235)",
      backgroundColor: "rgba(54, 162, 235, 0.5)",
      yAxisID: "y-axis-1"
    }
  ]
};

class Visitors extends Component {

  render() {
    const {title, description, stretched, usersState } = this.props;
    data.datasets[0].data= usersState;
    return (
      <WidgetBox title={title} description={description} stretched={stretched}>
        <Bar data={data} options={config.options} plugins={config.plugins}/>
      </WidgetBox>
    );
  }
}

const mapStateToProps = (state) => ({
  usersState: state.User.usersState
});

const Connect = connect(
  mapStateToProps,
)(Visitors);

export default Connect;