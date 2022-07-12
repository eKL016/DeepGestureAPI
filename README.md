# DeepGestureAPI
## Entrypoints
* GET
  * /experiment/:id -> Get the results of a specific experiment.
  * /experiments -> Get a list of all experiments (id).
  * /experiments.zip -> Download a zipped file containing all experiment results.
* DELETE
  * /experiment/:id -> Delete the results of a specific experiment.
* POST
  * /experiment -> Upload (single) experiment results.
