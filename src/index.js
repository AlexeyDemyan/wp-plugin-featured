import "./index.scss"

wp.blocks.registerBlockType("ourplugin/featured-professor", {
  title: "Professor Callout",
  description: "Include a short description and link to a professor of your choice",
  icon: "welcome-learn-more",
  category: "common",
  edit: EditComponent,
  save: function () {
    return null
  }
})

function EditComponent() {
  return (
    <div className="featured-professor-wrapper">
      <div className="professor-select-container">
        We will have a select dropdown form element here.
      </div>
      <div>
        The HTML preview of the selected professor will appear here.
      </div>
    </div>
  )
}