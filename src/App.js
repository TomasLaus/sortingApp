import React, { useState } from "react";
import "./App.css";
import { FaSkull } from "react-icons/fa";

const Column = ({ value, index }) => {
  return <div className="column" style={{ height: value * 14 }}></div>;
};

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const ColumnList = ({ values }) => {
  const [sortedValues, setSortedValues] = useState(values);
  const [withDelay, setWithDelay] = useState(true);
  const [delay, setDelay] = useState(10);
  const [isSorting, setIsSorting] = useState(false);

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const bubbleSort = async () => {
    setIsSorting(true);
    for (let i = 0; i < sortedValues.length; i++) {
      for (let j = 0; j < sortedValues.length - i - 1; j++) {
        if (sortedValues[j] > sortedValues[j + 1]) {
          const temp = sortedValues[j];
          sortedValues[j] = sortedValues[j + 1];
          sortedValues[j + 1] = temp;
          if (withDelay) {
            await sleep(delay);
          }
          setSortedValues([...sortedValues]);
        }
      }
    }
    setIsSorting(false);
  };

  const insertionSort = async () => {
    setIsSorting(true);
    const n = sortedValues.length;

    for (let i = 1; i < n; i++) {
      let key = sortedValues[i];
      let j = i - 1;

      while (j >= 0 && sortedValues[j] > key) {
        sortedValues[j + 1] = sortedValues[j];
        j--;
        if (withDelay) {
          await sleep(delay);
        }
        setSortedValues([...sortedValues]);
      }
      sortedValues[j + 1] = key;
      if (withDelay) {
        await sleep(delay);
      }
      setSortedValues([...sortedValues]);
    }
    setIsSorting(false);
  };

  const partition = async (arr, low, high) => {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        if (withDelay) {
          await sleep(delay);
        }
        setSortedValues([...arr]);
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

    return i + 1;
  };

  const quickSort = async (arr, low = 0, high = arr.length - 1) => {
    if (low < high) {
      const partitionIndex = await partition(arr, low, high);
      await quickSort(arr, low, partitionIndex - 1);
      await quickSort(arr, partitionIndex + 1, high);
    }
    return arr;
  };

  const handleQuickSort = async () => {
    setIsSorting(true);
    setSortedValues(await quickSort([...values], 0, values.length - 1));
    setIsSorting(false);
  };

  const bogosort = async (arr) => {
    function isSorted(arr) {
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) {
          return false;
        }
      }
      return true;
    }

    while (!isSorted(arr)) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        if (withDelay) {
          await sleep(delay);
        }
        setSortedValues([...arr]);
      }
    }
    setIsSorting(false);
    return arr;
  };

  const handleBogoSort = async () => {
    setIsSorting(true);
    setSortedValues(await bogosort(values));
  };

  const merge = async (arr, l, m, r) => {
    const n1 = m - l + 1;
    const n2 = r - m;

    const L = new Array(n1);
    const R = new Array(n2);

    for (let i = 0; i < n1; ++i) L[i] = arr[l + i];
    for (let j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];

    let i = 0,
      j = 0;
    let k = l;
    while (i < n1 && j < n2) {
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      if (withDelay) {
        await sleep(delay);
      }
      setSortedValues([...arr]);
      k++;
    }

    while (i < n1) {
      arr[k] = L[i];
      if (withDelay) {
        await sleep(delay);
      }
      setSortedValues([...arr]);
      i++;
      k++;
    }

    while (j < n2) {
      arr[k] = R[j];
      if (withDelay) {
        await sleep(delay);
      }
      setSortedValues([...arr]);
      j++;
      k++;
    }
  };

  const mergeSort = async (arr, l, r) => {
    if (l >= r) {
      return;
    }
    const m = l + Math.floor((r - l) / 2);
    await mergeSort(arr, l, m);
    await mergeSort(arr, m + 1, r);
    await merge(arr, l, m, r);
  };

  const handleMergeSort = async () => {
    setIsSorting(true);
    await mergeSort([...values], 0, values.length - 1);
    setIsSorting(false);
  };

  const handleReset = () => {
    setSortedValues([...shuffle(values)]);
  };

  return (
    <div className="column-list-container">
      <div className="column-list">
        {sortedValues.map((value, index) => (
          <Column key={index} value={value} index={index} />
        ))}
      </div>
      <div className="button-container">
        <button disabled={isSorting} onClick={handleQuickSort}>
          Quick sort
        </button>
        <button disabled={isSorting} onClick={bubbleSort}>
          Bubble Sort
        </button>
        <button disabled={isSorting} onClick={insertionSort}>
          Insertion Sort
        </button>
        <button disabled={isSorting} onClick={handleMergeSort}>
          Merge Sort
        </button>
        <button
          disabled={isSorting}
          onClick={handleBogoSort}
          className="bogosort"
        >
          <FaSkull /> <p>Bogo Sort</p>
        </button>
        <button disabled={isSorting} onClick={handleReset}>
          Reset
        </button>
      </div>
      <div className="timer-container">
        <div class="checkbox-wrapper-8">
          <p>Delay</p>
          <input
            className="tgl tgl-skewed"
            id="cb3-8"
            disabled={isSorting}
            checked={withDelay}
            onChange={(e) => setWithDelay(e.target.checked)}
            type="checkbox"
          />
          <label
            class="tgl-btn"
            data-tg-off="OFF"
            data-tg-on="ON"
            for="cb3-8"
          ></label>
        </div>

        <div>
          <p>ms</p>
          <input
            className="msInput"
            disabled={isSorting}
            value={delay}
            onChange={(e) => setDelay(parseInt(e.target.value))}
            type="number"
          />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  let columns = [];
  for (let i = 0; i < 50; i++) {
    columns.push(i + 1);
  }

  shuffle(columns);

  return (
    <div className="App">
      <ColumnList values={columns} />
    </div>
  );
}
