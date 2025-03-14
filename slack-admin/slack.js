import { API_ENDPOINT } from './config.js';

/* eslint-disable no-alert */
const allSlackChannels = document.getElementById('myslackchannels');
const slackChannelsContainer = document.getElementById('slack-channels-container');

const key = document.getElementById('api_key');

const persistFormFields = () => {
  localStorage.setItem('key', key.value);
};

const getAllSlackChannels = async () => {
  try {
    const response = await fetch(`${API_ENDPOINT}`, {
      headers: {
        'x-api-key': key.value,
      }
    });

    if (response.ok) {
      const channels = await response.json();
      return channels;
    }
  } catch (e) {};

  return [];
}

const refreshSaveButton = () => {
  const button = document.getElementById('save');

  const add = slackChannelsContainer.querySelectorAll('.add');
  const remove = slackChannelsContainer.querySelectorAll('.remove');

  if (add.length || remove.length) {
    button.removeAttribute('disabled');
  } else {
    button.setAttribute('disabled', true);
  }
};

const displayChannels = async () => {
  slackChannelsContainer.innerHTML = '<span class="spinner"></span>';

  const all = await getAllSlackChannels();
  all.sort((a, b) => a.name.localeCompare(b.name));

  const ul = document.createElement('ul');

  all.forEach(channel => {
    const li = document.createElement('li');

    const title = document.createElement('h4');
    title.textContent = channel.name;
    li.appendChild(title);

    const description = document.createElement('p');
    description.textContent = channel.purpose.value;
    li.appendChild(description);

    ul.appendChild(li);

  });

  const button = document.createElement('button');
  button.id = 'save';
  button.textContent = 'Save';
  button.disabled = true;
  button.classList.add('button');

  button.addEventListener('click', async () => {
    button.disabled = true;
    button.innerHTML = '<span class="spinner"></span>';
    const add = slackChannelsContainer.querySelectorAll('.add');

    const body = {
      add: [],
      remove: [],
    };

    add.forEach(async (li) => {
      const displayName = li.querySelector('h4').textContent;
      body.add.push(displayName);
    });


    const remove = slackChannelsContainer.querySelectorAll('.remove');

    remove.forEach(async (li) => {
      const name = li.querySelector('h4').textContent;
      body.remove.push(name);
    });

    displayChannels();
  });

  const wrapper = document.createElement('p');
  wrapper.classList.add('button-wrapper');
  wrapper.appendChild(button);

  slackChannelsContainer.innerHTML = '';
  slackChannelsContainer.appendChild(ul);
  slackChannelsContainer.appendChild(wrapper);
}

/**
 * Handles site admin form submission.
 * @param {Event} e - Submit event.
 */
allSlackChannels.addEventListener('click', async (e) => {
  e.preventDefault();
  persistFormFields();

  displayChannels();
});

key.value = localStorage.getItem('key') || '';

