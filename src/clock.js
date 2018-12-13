const state = {
  turnedOn: false,
  mode: "session",
  mins: 0,
  secs: 0,
  session: {
    ctrlLabel: "Session Length",
    timerLabel: "session",
    maxLength: 60,
    minLength: 1,
    length: 25
  },
  break: {
    ctrlLabel: "Break Length",
    timerLabel: "break",
    maxLength: 60,
    minLength: 1,
    length: 5
  }
}

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...state};
    this.increase = this.increase.bind(this);
    this.decrease = this.decrease.bind(this);
    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.reset = this.reset.bind(this);
    this.tick = this.tick.bind(this);
  }

  componentWillMount() {
    this.setState({
      mins: this.state[this.state.mode].length
    });
  }

  componentDidMount() {
    this.beep = document.getElementById('beep');
  }

  componentDidUpdate() {
    if (this.state.secs == 0 && this.state.mins == 0) {
      this.state.mode = 
      this.state.mode == "session" ? "break" : "session";
      this.state.mins = this.state[this.state.mode].length;
      this.beep.play();
      this.state.secs = 1; // Added for fcc test
    }
  }

  decrease(task) {
    let obj = JSON.parse(JSON.stringify(this.state));
    const inRange = obj[task].length > obj[task].minLength;
    obj[task].length = inRange ?
    obj[task].length -=1:
    obj[task].minLength;
    
    if (obj.mode == task) {
      obj.mins = obj[task].length;
    }

    if (!obj.turnedOn) {
      this.setState(obj);
    }
  }

  increase(task) {
    let obj = JSON.parse(JSON.stringify(this.state));
    const inRange = obj[task].length < obj[task].maxLength;
    obj[task].length = inRange ?
    obj[task].length +=1:
    obj[task].maxLength;

    if (obj.mode == task) {
      obj.mins = obj[task].length;
    }

    if (!obj.turnedOn) {
      this.setState(obj);
    }
  }

  reset() {
    let obj = JSON.parse(JSON.stringify(state));
    if (this.state.turnedOn) {this.pause();}
    if (!this.beep.paused) {this.beep.pause(); this.beep.load();}
    obj.mins = obj[obj.mode].length;
    this.setState(obj);
  }

  start() {
    // this.tick(); //Commented for fcc test.
    this.setState({turnedOn: !this.state.turnedOn});
    this.interval = setInterval(this.tick, 1000);
  }

  pause() {
    clearInterval(this.interval);
    delete this.interval;
    this.setState({turnedOn: !this.state.turnedOn});
  }

  tick() {
    let obj = this.state;
    obj.secs = obj.secs ? obj.secs - 1 : 59;
    obj.mins = obj.secs == 59 ? obj.mins -1 : obj.mins;
    this.setState(obj);
  }

  render() {
    const currentTask = this.state[this.state.mode];
    return(
      <div id="clock"
      className="row d-flex align-items-center px-0 col-sm-6 mx-auto py-3 border rounded text-center">
        <Timer
          mins = {('0'+this.state.mins).slice(-2)}
          secs = {('0'+this.state.secs).slice(-2)}
          label = {currentTask.timerLabel}
          reset = {this.reset}
          startPause = {
            this.state.turnedOn ? this.pause : this.start
          }
        />
        <div id="control-panel" className="col-lg-4 py-2">
          <Adjuster
            {...this.state.session}
            increase = {this.increase}
            decrease = {this.decrease}
          />
          <Adjuster
            {...this.state.break}
            increase = {this.increase}
            decrease = {this.decrease}
          />
        </div>
        <audio id="beep">
          <source
          src="https://www.jetclic.mx/assets/fcc/beep.mp3"
          type="audio/mpeg"/>
        </audio>
      </div>
    );
  }
}

function Adjuster(props) {
  return(
    <div id="adjuster" className="my-3">
      <div className="display-4 d-flex justify-content-center">
        <div id={`${props.timerLabel}-decrement`}
          className="text-right"
          onClick = {() => props.decrease(props.timerLabel)} >
          <i className="fa fa-caret-left" />
        </div>
        <div className="mx-3">
          <span id={`${props.timerLabel}-length`}>{props.length}</span>
        </div>
        <div id={`${props.timerLabel}-increment`}
          className="text-left"
          onClick = {() => props.increase(props.timerLabel)} >
          <i className="fa fa-caret-right" />
        </div>
      </div>
      <div id={`${props.timerLabel}-label`}>
        {props.ctrlLabel}
      </div>
    </div>
  );
}

function StartControls(props) {
  return(
    <div id="toggle-control" className="my-3">
      <button
      id="start_stop"
      className="btn btn-dark mx-1 px-4"
      onClick={props.startPause}
      >
        <i className="fa fa-power-off mr-2"></i>
        <span>Start</span>
      </button>
      <button
      id="reset"
      className="btn btn-dark mx-1 px-4"
      onClick={props.reset}
      >
        <i className="fa fa-sync-alt mr-2"></i>
        <span>Reset</span>
      </button>
    </div>
  );
}

function Timer(props) {
  return(
    <div id="timer" className="col-lg-8">
      <div id="time-left"
        className="display-2">
        {props.mins}:{props.secs}
      </div>
      <span id="timer-label" className="h4">
        {`${props.label} time`}
      </span>
      <StartControls
        startPause = {props.startPause}
        reset = {props.reset}
      />
    </div>
  );
}

ReactDOM.render(
  <Clock />,
  document.getElementById('clock-wrapper')
);