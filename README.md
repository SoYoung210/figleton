# figeleton

Skeleton Code Generator Figma Plugin consisting of [@figeleton/skeleton](#figeleton-skeleton) package and [@figeleton/figma-plugin](#figeleton-figma-plugin)

Skeleton components generated in @figeleton/figma-plugin follow the specifications of @figeleton/skeleton.

Although it is not necessary to use the two packages together, **additional feature of this plugin are added based on @figeleton/skeleton specification.**

## @figeleton/figma-plugin

Generate Skeleton Component from [Figma](https://www.figma.com). Use Figma as a source.

* ⚙️ Built on [Figma Plugin API](https://www.figma.com/plugin-docs/intro/).
* 🚫 **Is not a design generator**

<p align="center"><img src="./assets/demo.gif" width="800"></p>


### Options

| Name      | Value                  | Description                                                                            |
| --------- | ---------------------- | -------------------------------------------------------------------------------------- |
| Animation | `wave` `pulse` `unset` | Value of Skeleton animation prop. Preview of the option can be found here.             |
| Square as | `square` `circle`      | whether to generate a square node on Figma as a circular skeleton or as it(square) is. |


## @figeleton/skelton

Skeleton component. (It can be used alone regardless of figma plugin.)

## Contributing

Everyone is welcome to contribute. Whether you're helping us implement features, fix bugs or improve the docs, we'd love to have you as part of the community!

Leave any questions or feature requests to [issue](https://github.com/SoYoung210/figeleton/issues/new).
