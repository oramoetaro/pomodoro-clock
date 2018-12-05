function ControlPanel (props) {
  return (
    <div id="controls" className="col-lg-4">
      <LengthCrl
        {...props.session}
        decrease={props.decrease}
        increase={props.increase}
      />
      <LengthCrl
        {...props.break}
        decrease={props.decrease}
        increase={props.increase}
      />
      <ResetBtn reset={props.reset} />
      <StartBtn start={props.start} />
    </div>
  );
}

function LengthCrl (props) {
  return (
    <div className="length-control my-2">
      <div className="display-4">
        <Decrement
          name={props.timerLabel}
          decrease={props.decrease}
        />
        <Length
          name={props.timerLabel}
          length={props.length}
        />
        <Increment
          name={props.timerLabel}
          increase={props.increase}
        />
      </div>
      <span className="h6">{props.ctrlLabel}</span>
    </div>
  );
}

function Length (props) {
  return (
    <span id={`${props.name}-length`} className="mx-2">
      {('0' + props.length).slice(-2)}
    </span>
  );
}

function Decrement (props) {
  return (
    <span id={`${props.name}-decrement`} 
    onClick={() => {props.decrease(props.name)}}>
      <i className="fas fa-xs fa-angle-left"></i>
    </span>
  );
}

function Increment (props) {
  return (
    <span id={`${props.name}-increment`}
    onClick={() => {props.increase(props.name)}}>
      <i className="fas fa-xs fa-angle-right"></i>
    </span>
  );
}

function ResetBtn(props) {
  return (
    <div id="reset" className="float-right" onClick={props.reset}>
      <i className="fas fa-sync-alt fa-lg"></i>
    </div>
  );
}

function StartBtn(props) {
  return(
    <div
      id="start_stop"
      className="float-right mr-3"
      onClick={props.start}
    >
      <i className="fas fa-play fa-lg"></i>
      <i className="fas fa-pause fa-lg"></i>
    </div>
  );
}

function Timer(props) {
  return (
    <div id="timer" className="col-lg-8 border-right">
      <p id="time-left" className="display-1 m-0">
        {('0'+props.minutes).slice(-2)}:
        {('0'+props.seconds).slice(-2)}
      </p>
      <p id="timer-label">
        {props.label}
      </p>
  </div>
  );
}

const defaultState = {
  break: {
    ctrlLabel: "Break Length",
    timerLabel: "break",
    maxLength: 60,
    minLength: 1,
    length: 1
  },
  session: {
    ctrlLabel: "Session Length",
    timerLabel: "session",
    maxLength: 60,
    minLength: 1,
    length: 1
  },
  mode: "session",
  turnedOn: false
};

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  componentWillMount() {
    this.reset();
  }
  
  componentDidMount() {
    this.interval = setInterval(
      () => this.tick(),
      1000
    );
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  reset() {
    this.setState(defaultState);
    const mins = this.state.mode == "session" ?
    this.state.session.length:
    this.state.break.length;

    this.setState({
      minutes: mins,
      seconds: 0
    });
  }

  decrease (name) {
    const task = this.state[name];
    if (task.length > task.minLength) {
      task.length -= 1;
      this.setState({
        minutes: task.length,
        [task]: task
      });
    }
  }

  increase (name) {
    const task = this.state[name];
    if (task.length < task.maxLength) {
      task.length += 1;
      this.setState({
        minutes: task.length,
        [task]: task
      });
    }
  }

  tick() {
    let obj = {};

    switch (this.state.seconds) {
      case 0: {
        obj.seconds = 59;
        if (this.state.minutes) {
          obj.minutes = this.state.minutes - 1;
        } else {
          obj.minutes = this.state.mode == "session" ?
          this.state.break.length -1:
          this.state.session.length -1;
          obj.mode = this.state.mode == "session" ?
          "break" : "session";
        } break;
      }
      default: {
        obj.seconds = this.state.seconds - 1;
      }
    }

    if (this.state.turnedOn) {
      this.setState(obj);
    }
  }

  start() {
    this.setState({
      turnedOn: !this.state.turnedOn
    });
  }

  render() {

    this.activated = this.state.mode == "session" ?
    this.state.session : this.state.break;

    return(
      <div id="clock" className="row col-lg-4 mx-auto py-3 border rounded">
        <Timer
          minutes={this.state.minutes}
          seconds={this.state.seconds}
          label={this.activated.timerLabel}
        />
        <ControlPanel
          start={this.start.bind(this)}
          reset={this.reset.bind(this)}
          decrease={this.decrease.bind(this)}
          increase={this.increase.bind(this)}
          break={this.state.break}
          session={this.state.session}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('clock-wrapper')
);