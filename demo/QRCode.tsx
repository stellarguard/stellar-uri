import qr from 'qrcode';
import * as React from 'react';

const styles = () => ({});

class QRCode extends React.Component<
  {
    uri: string;
  },
  any
> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props, state) {
    super(props, state);
    this.canvasRef = React.createRef();
  }
  public render() {
    return <canvas ref={this.canvasRef} />;
  }

  public componentDidMount() {
    this.updateCode();
  }

  public componentDidUpdate() {
    this.updateCode();
  }

  private updateCode() {
    const { uri } = this.props;
    const canvas = this.canvasRef.current;
    if (uri) {
      qr.toCanvas(canvas, uri);
    } else {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
}

export default QRCode;
