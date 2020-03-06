import Head from "next/head";
import React, { MouseEvent, ChangeEvent } from "react";
import { NextPageContext } from "next";
import CheckBox from "../components/CheckBox";

const workTime: number = 25 * 60 * 1000;
const restTime: number = 5 * 60 * 1000;

interface State {
  time: number;
  endTime: number;
  pauseTime: number;
  minutes: number;
  seconds: number;
  paused: boolean;
  repeat: boolean;
}

class Home extends React.Component<{}, State> {
  private interval: number = -1;

  constructor(props: {}) {
    super(props);

    let now: number = new Date().getTime();
    this.state = {
      time: now + workTime,
      endTime: now + workTime + restTime,
      pauseTime: now,
      minutes: Math.trunc(workTime / (60 * 1000)),
      seconds: Math.trunc((workTime / 1000) % 60),
      paused: true,
      repeat: true
    };
  }

  tick = () => {
    let now: number = new Date().getTime();
    if (now > this.state.endTime)
      if (this.state.repeat)
        this.setState({
          time: now + workTime,
          endTime: now + workTime + restTime
        });
      else
        this.setState({
          time: now + workTime,
          endTime: now + workTime + restTime,
          paused: true,
          pauseTime: now
        });
    this.setState({
      minutes: this.getMinutes(now),
      seconds: this.getSeconds(now)
    });
  };

  toggleRepeat = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ repeat: !this.state.repeat });
  };

  toggle = (e: MouseEvent) => {
    let now: number = new Date().getTime();
    if (!this.state.paused) {
      if (this.interval != -1) clearInterval(this.interval);
      this.setState({ pauseTime: now, paused: true });
    } else {
      this.setState({
        time: this.state.time + (now - this.state.pauseTime),
        endTime: this.state.endTime + (now - this.state.pauseTime),
        minutes: this.getMinutes(now),
        seconds: this.getSeconds(now),
        paused: false
      });
      this.interval = window.setInterval(this.tick, 200);
    }
  };

  getMinutes(now: number): number {
    let remaining: number = this.getRemaining(now);
    return Math.trunc(remaining / (1000 * 60));
  }

  getRemaining(now: number): number {
    if (this.state.paused) now = this.state.pauseTime;
    if (now > this.state.endTime) return 0;
    else
      return (
        (now < this.state.time ? this.state.time : this.state.endTime) - now
      );
  }

  getSeconds(now: number): number {
    let remaining: number = this.getRemaining(now);
    return Math.trunc((remaining / 1000) % 60);
  }

  render = () => {
    return (
      <div id="root">
        <Head>
          <link rel="stylesheet" href="/static/reset.css" />
          <link
            href="https://fonts.googleapis.com/css?family=Noto+Sans+JP&display=swap"
            rel="stylesheet"
          />
          <link rel="stylesheet" href="/static/main.css" />
        </Head>
        <header>
          <h1>Pomodoro Timer</h1>
        </header>
        <main>
          <h2 id="time">
            {this.state.minutes}:
            {this.state.seconds.toString().padStart(2, "0")}
          </h2>
          <div id="controls">
            <button onClick={this.toggle} type="button">
              {this.state.paused ? "Start" : "Pause"}
            </button>
            <CheckBox
              isChecked={true}
              onCheck={this.toggleRepeat}
              name="repeat"
            />
            <label htmlFor="repeat">Repeat</label>
          </div>
          <audio src=""></audio>
        </main>
      </div>
    );
  };
}
export default Home;
