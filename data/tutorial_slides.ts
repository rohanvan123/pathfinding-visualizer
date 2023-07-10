import { TutorialSlide } from "@/types/types";

export const PathVisualizerSlides: TutorialSlide[] = [
  {
    title: "Welcome to the Path Algorithms Visualizer!",
    subheading: "This is a brief tutorial on how to use the app",
    content: "",
    contentStyling: "",
    img: "https://static.thenounproject.com/png/3541888-200.png",
    imgStyling: "w-[250px] h-[250px]",
  },
  {
    title: "Context",
    subheading:
      "The grid below is composed of a graph like format, which a user can expirement with four different types of algorithms",
    content: `
    **Breadth First Search**: Guarantees shortest path in unweighted graph
    **Depth First Search**: Does not guarantee shortest path
    **Dijkstra's Algorithm**: Gaurantees shortest path in weighted graph 
    **A* Search Algorithm**: Faster implementaion of Dijkstra's with hueristics
    `,
    contentStyling: "whitespace-pre-line text-left text-[15px] leading-[3]",
    img: "",
    imgStyling: "",
  },
  {
    title: "Visualizing an Algorithm",
    subheading: "Choose an algorithm from the dropdown selection",
    content: `
    You can choose to run any one of the four algorithms from the **dropdown** (set to **BFS** by default). 
    As long as you are not setting the target or placing any walls, simply click on any square from the grid to begin
    visualizing the chosen algorithm. Finally, you can reset the grid to remove any walls and additional coloring by pressing 
    the **Reset** button. Avoid pressing any other buttons while a visualization is running for best performance.
    `,
    contentStyling: "mt-[40px] w-[80%] leading-[2] text-[15px]",
    img: "",
    imgStyling: "",
  },
  {
    title: "Placing Targets and Walls",
    subheading: "Use the legend at the top for reference of colors",
    content: `
    You can place a single target node by selecting the **Set Target** button and choosing a specific cell on the grid. 
    To place walls along the grid, press the **Place Walls** button. You will know you are doing one of these actions 
    when the corresponding button is fully **green**. Then, simply deselct to stop moving the target or addings walls. Also note
    that some algorithms like **A* Search** depend on a target node, which is configured to (0, 0) by default.
    `,
    contentStyling: "mt-[40px] w-[80%] leading-[2] text-[15px]",
    img: "",
    imgStyling: "",
  },
  {
    title: "Weighted Graphs and Heuristics",
    subheading: "Shortest path algorithms in realistic settings",
    content: `
    To truly see the power of algorithms like A* Search and Dijkstra's you must visualize them with **weighted graphs**. 
    To Toggle weights, press the **Show Weights** button, and you will be able to see the weight of each node. 
    The cost of traveling between two nodes is the absolute value of their difference in weight. For example, this can be thought of as
    an elevation map in which one is trying to minimize the change in elevation on a path from start to finish.
    `,
    contentStyling: "mt-[40px] w-[80%] leading-[2] text-[15px]",
    img: "",
    imgStyling: "",
  },
];
