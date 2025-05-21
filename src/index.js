import './index.scss';
import { useSelect } from '@wordpress/data';
import { useState, useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';
// creating a shortcut of global WP translate method
// It's also important to go to Setting of Loco translate and give value of "js" to "Scan Javascript files with extensions"
const __ = wp.i18n.__;

wp.blocks.registerBlockType('ourplugin/featured-professor', {
  title: 'Professor Callout',
  description:
    'Include a short description and link to a professor of your choice',
  icon: 'welcome-learn-more',
  category: 'common',
  attributes: {
    profId: { type: 'string' },
  },
  edit: EditComponent,
  save: function () {
    return null;
  },
});

// This is sort of a wrapper around wp.data.select("core").getEntityRecords("postType", "professor", {per_page: -1})

function EditComponent(props) {
  const [preview, setPreview] = useState('');
  useEffect(() => {
    // wrapping it in condition to make sure nothing renders when we first add the block:
    if (props.attributes.profId) {
      updateMetaData();

      async function go() {
        const response = await apiFetch({
          path: `/featuredProfessor/v1/getHTML?profId=${props.attributes.profId}`,
          method: 'GET',
        });
        setPreview(response);
      }
      go();
    }
  }, [props.attributes.profId]);

  useEffect(() => {
    // Returninig a cleanup function, where we call update function once component unmounts
    return () => {
      updateMetaData();
    };
  }, []);

  function updateMetaData() {
    // getting all blocks within the Editor, filtering to only get the Plugin blocks
    // And then using map to basically extract profId values only
    const profsForMeta = wp.data
      .select('core/editor')
      .getBlocks()
      .filter((block) => block.name == 'ourplugin/featured-professor')
      .map((block) => block.attributes.profId);

    // There is also an argument to remove duplicates from the profsForMeta
    // But it seems a bit of an edge-case overkill

    wp.data
      .dispatch('core/editor')
      .editPost({ meta: { featuredProfessor: profsForMeta } });
  }

  const allProfs = useSelect((select) => {
    return select('core').getEntityRecords('postType', 'professor', {
      per_page: -1,
    });
  });

  console.log(allProfs);

  return (
    <div className='featured-professor-wrapper'>
      <div className='professor-select-container'>
        {allProfs ? (
          <select
            onChange={(e) => props.setAttributes({ profId: e.target.value })}
          >
            <option value=''>
              {__('Select a professor', 'featured-professor')}
            </option>
            {allProfs.map((prof) => (
              <option
                value={prof.id}
                selected={props.attributes.profId == prof.id}
              >
                {prof.title.rendered}
              </option>
            ))}
          </select>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div dangerouslySetInnerHTML={{ __html: preview }}></div>
    </div>
  );
}
