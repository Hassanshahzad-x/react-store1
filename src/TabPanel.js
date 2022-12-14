import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { Tabs, Tab } from '@mui/material'
import PropTypes from 'prop-types'
import clsx from 'clsx'

const PREFIX = 'RSFTabPanel'

const defaultClasses = {
  root: `${PREFIX}-root`,
  panel: `${PREFIX}-panel`,
  hidden: `${PREFIX}-hidden`,
}

const Root = styled('div')(({ theme }) => ({
  /**
   * Styles applied to the root element.
   */
  [`&.${defaultClasses.root}`]: {},

  /**
   * Styles applied to the wrapper around each panel element.
   */
  [`& .${defaultClasses.panel}`]: {
    margin: `${theme.spacing(2)} 0`,
  },

  /**
   * Styles applied to the wrapper around each panel element when that panel is hidden.
   */
  [`& .${defaultClasses.hidden}`]: {
    display: 'none',
  },
}))

export {}

/**
 * A simple tab panel that is AMP-compatible.  Tab names are pulled from the label prop of the child elements.
 * Any type of element can be a child.
 *
 * Example:
 *
 * ```js
 *  <TabPanel>
 *    <div label="Description">
 *      Description here
 *    </div>
 *    <CmsSlot label="Instructions">
 *      { instructionsFromCms }
 *    </CmsSlot>
 *  </TabPanel>
 * ```
 */
export default function TabPanel({
  children,
  classes: c = {},
  scrollable,
  selected: selectedProp,
  onChange,
  tabsProps,
  tabProps,
  panelProps,
  renderPanels,
}) {
  const classes = { ...defaultClasses, ...c }
  const [selected, setSelected] = useState(selectedProp)
  const tabs = []

  const panels = []

  const onChangeHandler = (event, selected) => {
    setSelected(selected)

    if (onChange) {
      onChange(selected)
    }
  }

  React.Children.forEach(children, (child, index) => {
    tabs.push(
      <Tab key={index} label={child.props.label} {...tabProps({ child, index, selected })} />,
    )

    const { className, ...others } = panelProps({ child, index, selected }) || {}

    panels.push(
      <div
        key={index}
        role="tabpanel"
        className={clsx(classes.panel, {
          [classes.hidden]: index !== selected,
          [className]: true,
        })}
        {...others}
      >
        {React.cloneElement(child, { label: null })}
      </div>,
    )
  })

  return (
    <Root className={classes.root}>
      <Tabs
        indicatorColor="primary"
        textColor="inherit"
        variant={scrollable ? 'scrollable' : null}
        value={selected}
        onChange={onChangeHandler}
        {...tabsProps}
      >
        {tabs}
      </Tabs>
      {renderPanels(panels)}
    </Root>
  )
}

TabPanel.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * Set to false to prevent the tabs from scrolling.
   */
  scrollable: PropTypes.bool,

  /**
   * Selected tab index.
   */
  selected: PropTypes.number,
  /**
   * Called when the selected tab is changed.
   */
  onChange: PropTypes.func,

  /**
   * A function that takes an object containing:
   *
   * - child: The child element
   * - index: The index of the child
   * - selected: The index of the currently selected element
   *
   * ... and returns props for the corresponding Material UI `Tab` element.
   */
  tabProps: PropTypes.func,

  /**
   * A function that takes an object containing:
   *
   * - child: The child element
   * - index: The index of the child
   * - selected: The index of the currently selected element
   *
   * ... and returns props for the corresponding panel `div` element.
   */
  panelProps: PropTypes.func,

  /**
   * Props for the Material UI `Tabs` element.
   */
  tabsProps: PropTypes.object,

  /**
   * A function that takes the panels as an argument and returns a react element to render.
   */
  renderPanels: PropTypes.func,
}

TabPanel.defaultProps = {
  scrollable: true,
  selected: 0,
  tabProps: Function.prototype,
  panelProps: Function.prototype,
  renderPanels: panels => panels,
}
