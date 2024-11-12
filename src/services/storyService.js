import storyContent from '../data/storyContent.json';

class StoryService {
  constructor() {
    this.content = storyContent;
    this.validateContent();
  }

  validateContent() {
    if (!this.content || !this.content.game || !this.content.game.initialScene) {
      throw new Error('Invalid story content structure');
    }
  }

  getInitialScene() {
    return {
      ...this.content.game.initialScene,
      id: 'initial'
    };
  }

  getScene(sceneId) {
    if (sceneId === 'initial') {
      return this.getInitialScene();
    }
    const scene = this.content.game.scenes[sceneId];
    if (!scene) {
      throw new Error(`Scene not found: ${sceneId}`);
    }
    return {
      ...scene,
      id: sceneId
    };
  }

  getWorldContent() {
    return this.content.world;
  }
}

const storyService = new StoryService();
export default storyService;
