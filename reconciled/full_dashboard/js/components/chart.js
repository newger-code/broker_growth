/**
 * Commission Intelligence Platform - Chart Components
 * Lightweight charting utilities (no dependencies)
 */

const Chart = {
  /**
   * Create a simple sparkline SVG
   */
  createSparkline(data, width = 100, height = 30) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((value, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return `
      <svg width="${width}" height="${height}" style="display: block;">
        <polyline
          points="${points}"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `;
  },

  /**
   * Create a bar chart
   */
  createBarChart(data, options = {}) {
    const {
      width = 400,
      height = 200,
      barColor = '#3b82f6',
      labelColor = '#94a3b8'
    } = options;

    const max = Math.max(...data.map(d => d.value));
    const barWidth = width / data.length;

    const bars = data.map((item, i) => {
      const barHeight = (item.value / max) * (height - 30);
      const x = i * barWidth;
      const y = height - barHeight - 20;

      return `
        <g>
          <rect
            x="${x + barWidth * 0.1}"
            y="${y}"
            width="${barWidth * 0.8}"
            height="${barHeight}"
            fill="${barColor}"
            rx="4"
          />
          <text
            x="${x + barWidth / 2}"
            y="${height - 5}"
            text-anchor="middle"
            font-size="10"
            fill="${labelColor}"
          >${item.label}</text>
        </g>
      `;
    }).join('');

    return `
      <svg width="${width}" height="${height}">
        ${bars}
      </svg>
    `;
  }
};
