/**
 * Created by Wickramaranga on 1/16/2017.
 */
import { component } from 'cycle-react/rxjs';
import Rx from 'rxjs/Rx';
import React from 'react';
import { Card, Button, Row, Col, Progress, Icon, Tooltip } from 'antd';

const ButtonGroup = Button.Group;

const CountdownView = component('CountdownView', function(interactions, props) {
  const totalSeconds =
    props.value.seconds + 60 * props.value.minutes + 3600 * props.value.hours;

  const clockStream = Rx.Observable.interval(1000);
  const pauseStream = interactions
    .get('OnPause')
    .map(_ => true)
    .startWith(false)
    .scan((a, b) => !a);
  const restartStream = interactions
    .get('OnRestart')
    .map(_ => true)
    .concatMap(
      // `false` keeps the timer running. `true` sets the timer state to initial.
      // This sends a `false` initially, and then a `true` followed by a `false` delayed by 1 second
      // because, everything depends on the clock pulse, which is generated only once per second.
      _ =>
        Rx.Observable.from([false])
          .delay(1000)
          .startWith(true)
    )
    .startWith(false);

  const finalStream = clockStream
    .withLatestFrom(pauseStream, restartStream, (clock, pause, restart) => ({
      restart: restart, // whether counter needed to be restarted
      pause: pause, // Need to transfer the state to internal function
      counter: pause ? 0 : 1 // Converting the number stream to a pulse stream
    }))
    .scan((xo, yo) => ({
      pause: yo.pause,
      counter: yo.restart
        ? 1
        : xo.counter >= totalSeconds
          ? totalSeconds
          : xo.counter + yo.counter
    }));

  return finalStream.map(function(state) {
    const countdown = totalSeconds - state.counter;

    const hours = Math.floor(countdown / 3600.0);
    const minutes = Math.floor((countdown % 3600) / 60.0);
    const seconds = countdown % 60;

    const toPercent = value => value * 5 / 3.0;
    const status =
      countdown <= 0 ? 'success' : state.pause ? 'exception' : 'active';
    const formatInner = str => (
      <div>
        <div>
          {countdown <= 0 ? (
            <Icon type="check" />
          ) : state.pause ? (
            <Icon type="pause" />
          ) : (
            <Icon type="caret-left" />
          )}
        </div>
        <div>{str}</div>
      </div>
    );

    return (
      <div>
        <Card
          title="Pomodoro Timer"
          bordered={false}
          extra={
            <ButtonGroup>
              <Tooltip title={state.pause ? 'Resume' : 'Pause'}>
                <Button
                  icon={state.pause ? 'caret-left' : 'pause'}
                  disabled={countdown <= 0}
                  onClick={interactions.listener('OnPause')}
                />
              </Tooltip>
              <Tooltip title="Restart">
                <Button
                  icon="reload"
                  disabled={countdown <= 0}
                  onClick={interactions.listener('OnRestart')}
                />
              </Tooltip>
            </ButtonGroup>
          }
        >
          <Row gutter={8} type="flex" justify="space-around">
            <Col span={8}>
              <Progress
                width={256}
                strokeWidth={2}
                type="circle"
                status={status}
                percent={countdown <= 0 ? 100 : toPercent(hours)}
                format={() => formatInner(`${hours} h`)}
              />
            </Col>
            <Col span={8}>
              <Progress
                width={256}
                strokeWidth={2}
                type="circle"
                status={status}
                percent={countdown <= 0 ? 100 : toPercent(minutes)}
                format={() => formatInner(`${minutes} min.`)}
              />
            </Col>
            <Col span={8}>
              <Progress
                width={256}
                strokeWidth={2}
                type="circle"
                status={status}
                percent={countdown <= 0 ? 100 : toPercent(seconds)}
                format={() => formatInner(`${seconds} s`)}
              />
            </Col>
          </Row>
        </Card>
      </div>
    );
  });
});

export default CountdownView;
