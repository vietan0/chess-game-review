// eslint-disable-next-line ts/ban-ts-comment
// @ts-nocheck
// Function taken from https://gist.github.com/ornicar/a097406810939cf7be1df8ea30e94f3e

export default function readStream(processLine) {
  return (response) => {
    const stream = response.body.getReader();
    const matcher = /\r?\n/;
    const decoder = new TextDecoder();
    let buf = '';

    const loop = () =>
      stream.read().then(({ done, value }) => {
        if (done) {
          if (buf.length > 0)
            processLine(JSON.parse(buf));
        }
        else {
          const chunk = decoder.decode(value, {
            stream: true,
          });

          buf += chunk;

          const parts = buf.split(matcher);
          buf = parts.pop();
          for (const i of parts.filter(p => p)) processLine(JSON.parse(i));

          return loop();
        }
      });

    return loop();
  };
}
