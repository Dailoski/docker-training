## Install the buildx component to build images with BuildKit

MacOS:

```bash
brew install buildx
mkdir -p ~/.docker/cli-plugins
ln -sfn $(which docker-buildx) ~/.docker/cli-plugins/docker-buildx
docker buildx install
```
