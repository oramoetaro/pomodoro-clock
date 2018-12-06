var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultState = {
  session: {
    ctrlLabel: "Session Length",
    timerLabel: "Session Time",
    maxLength: 60,
    minLength: 1,
    length: 1
  },
  break: {
    ctrlLabel: "Break Length",
    timerLabel: "Break Time",
    maxLength: 60,
    minLength: 1,
    length: 5
  }
};

var Clock = function (_React$Component) {
  _inherits(Clock, _React$Component);

  function Clock(props) {
    _classCallCheck(this, Clock);

    var _this = _possibleConstructorReturn(this, (Clock.__proto__ || Object.getPrototypeOf(Clock)).call(this, props));

    _this.state = defaultState;
    _this.startPause = _this.startPause.bind(_this);
    _this.tick = _this.tick.bind(_this);
    return _this;
  }

  _createClass(Clock, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.turnedOn = false;
      this.mode = "session";
      this.state.mins = this.state[this.mode].length;
      this.state.secs = 0;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.state.secs == 0 && this.state.mins == 0) {
        this.mode = this.mode == "session" ? "break" : "session";
      }
    }
  }, {
    key: "startPause",
    value: function startPause() {
      this.turnedOn = !this.turnedOn;
      if (this.turnedOn) {
        this.tick();
        this.interval = setInterval(this.tick, 1000);
      } else {
        clearInterval(this.interval);
        delete this.interval;
      }
    }
  }, {
    key: "tick",
    value: function tick() {
      obj = this.state;
      obj.secs = obj.secs ? obj.secs - 1 : 59;
      obj.mins = obj.secs == 59 ? obj.mins - 1 : obj.mins;
      this.setState(obj);
    }
  }, {
    key: "render",
    value: function render() {
      var currentTask = this.state[this.mode];
      return React.createElement(
        "div",
        { id: "clock", className: "border rounded text-center" },
        React.createElement(Timer, {
          mins: ('0' + this.state.mins).slice(-2),
          secs: ('0' + this.state.secs).slice(-2),
          label: currentTask.timerLabel
        }),
        React.createElement(
          "div",
          { id: "control-panel" },
          React.createElement(StartControls, {
            startPause: this.startPause
          })
        )
      );
    }
  }]);

  return Clock;
}(React.Component);

function StartControls(props) {
  return React.createElement(
    "div",
    { id: "toggle-control", className: "my-3" },
    React.createElement(
      "button",
      { className: "btn btn-dark mx-1 px-4",
        onClick: props.startPause
      },
      React.createElement("i", { className: "fa fa-power-off mr-2" }),
      React.createElement(
        "span",
        null,
        "Start"
      )
    ),
    React.createElement(
      "button",
      { className: "btn btn-dark mx-1 px-4" },
      React.createElement("i", { className: "fa fa-sync-alt mr-2" }),
      React.createElement(
        "span",
        null,
        "Reset"
      )
    )
  );
}

function Timer(props) {
  return React.createElement(
    "div",
    { id: "timer" },
    React.createElement(
      "div",
      { className: "display-2" },
      props.mins,
      ":",
      props.secs
    ),
    React.createElement(
      "span",
      { className: "h4" },
      props.label
    )
  );
}

ReactDOM.render(React.createElement(Clock, null), document.getElementById('clock-wrapper'));